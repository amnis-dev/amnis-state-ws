import type { LogCreator } from '../log/index.js';
import { uid } from '../../uid.js';
import type {
  Locale, LocaleBase, LocaleCreator, LocaleTranslationKey, LocaleTranslation,
} from './locale.types.js';

export const localeKey = 'locale';

export const localeBase: LocaleBase = {
  code: 'en',
  set: 'core',
  t: {},
  v: [],
};

/**
 * defines a translation key
 */
export function tk(key: string) {
  return key as LocaleTranslationKey;
}

/**
 * Translate method
 */
export function t(
  translations: LocaleTranslation,
  key: LocaleTranslationKey,
  ...args: string[]
) {
  if (key.length > 64) {
    return key;
  }
  if (typeof translations[key] !== 'string') {
    return key;
  }
  return translations[key].replace(
    /{(\d+)}/g,
    (match, number) => (
      typeof args[number] !== 'undefined' ? args[number] : match
    ),
  );
}

/**
 * Locale check method.
 */
export function localeCheck(locale: Locale): LogCreator[] {
  const logs: LogCreator[] = [];

  if (locale.code.length !== 2) {
    logs.push({
      title: 'Invalid Locale Code',
      description: 'Locale code must be a two-letter code for ISO 693 macrolanguage.',
      level: 'error',
    });
  }

  return logs;
}

export function localeCreator(
  locale: LocaleCreator,
): Locale {
  return {
    ...localeBase,
    ...locale,
    $id: uid(localeKey),
  };
}
