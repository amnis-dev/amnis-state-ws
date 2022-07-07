import { entityCreate } from '../entity';
import type { LogBaseCreate } from '../log';
import type {
  Locale, LocaleBase, LocaleBaseCreate, LocaleTranslationKey, LocaleTranslations,
} from './locale.types';

export const localeKey = 'locale';

export const localeBase: LocaleBase = {
  code: 'en',
  set: 'core',
  t: {},
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
  translations: LocaleTranslations,
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
export function localeCheck(locale: Locale): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  if (locale.code.length !== 2) {
    logs.push({
      title: 'Invalid Locale Code',
      description: 'Locale code must be a two-letter code for ISO 693 macrolanguage.',
      level: 'error',
    });
  }

  return logs;
}

export function localeCreate(
  locale: LocaleBaseCreate,
): Locale {
  const localeEntity = entityCreate<Locale>(localeKey, {
    ...localeBase,
    ...locale,
  });

  return localeEntity;
}
