import { useEffect } from 'react';
import { getLocales } from 'expo-localization';

import { Locale, useGame } from '../store/game';
import { en } from './en';
import { ka } from './ka';

export type { Strings } from './en';

export const locales = { en, ka };

export const localeNames: Record<Locale, string> = {
  ka: 'ქართული',
  en: 'English',
};

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
