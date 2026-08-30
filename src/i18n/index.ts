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
