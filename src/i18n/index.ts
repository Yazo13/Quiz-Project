import { useEffect } from 'react';
import { getLocales } from 'expo-localization';

import { dateParts, relative } from '../lib/time';
import { Locale, useGame } from '../store/game';
import { en, type Strings } from './en';
import { ka } from './ka';

export type { Strings } from './en';

export const locales = { en, ka };

export const localeNames: Record<Locale, string> = {
  ka: 'ქართული',
  en: 'English',
};

/**
 * A timestamp as "3 hours ago", in the active language.
 *
 * `relative` deliberately returns a unit and a value rather than a finished
 * string, so it knows nothing about wording; this is the other half. The
 * wallet and the profile each had their own identical copy of it.
 */
export function whenLabel(at: number, when: Strings['wallet']['when']): string {
  const { unit, value } = relative(at);
  if (unit === 'now') return when.now;
  return when[unit](value);
}

/**
 * A calendar date in the active language.
 *
 * Not `toLocaleDateString`, which reads the device locale: the app's language
 * is a setting the player chose, and a Georgian app on an English phone was
 * printing 9/4/2026 under Georgian labels. `src/lib/number.ts` exists for the
 * same reason on the numbers.
 */
export function dateLabel(at: number, strings: Strings): string {
  const { day, month, year } = dateParts(at);
  return strings.date(day, strings.months[month], year);
}

/** The active locale. Persisted, so the choice survives a restart. */
export function useLocale() {
  return useGame((s) => s.locale);
}

export function useSetLocale() {
  return useGame((s) => s.setLocale);
}

/**
 * The whole string table for the active locale.
 *
 * Returning the object rather than a `t('some.key')` lookup keeps every label
 * type-checked and autocompleted, and makes a missing translation a build
 * error instead of a key echoed back on screen.
 */
export function useT() {
  return locales[useLocale()];
}

/**
 * The language the device is set to, if the app speaks it.
 *
 * Georgian reports as `ka`; anything else falls back to English rather than
 * guessing, since those are the only two tables that exist.
 */
export function deviceLocale(): Locale | null {
  for (const { languageCode } of getLocales()) {
    if (languageCode === 'ka') return 'ka';
    if (languageCode === 'en') return 'en';
  }
  return null;
}

/**
 * Adopts the device language on first run.
 *
 * Only applies while the player has not chosen for themselves — after that
 * their choice wins, even if they later switch the phone's language.
 *
 * `ready` must be the hydration flag. Running before the saved state is read
 * would suggest a language against the defaults, and hydration would then
 * merge the stored one back over it — the suggestion would appear to work and
 * then silently undo itself.
 */
export function useDeviceLocale(ready: boolean) {
  const suggest = useGame((s) => s.suggestLocale);

  useEffect(() => {
    if (!ready) return;
    const device = deviceLocale();
    if (device) suggest(device);
  }, [ready, suggest]);
}
