import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity';

/**
 * Symbol to make a special locale type.
 */
declare const localeSymbol: unique symbol;

/**
 * A string that represents a key on a locale translation record.
 */
export type LocaleTranslationKey = string & {[localeSymbol]: never};

/**
 * Record of locale translations.
 */
export type LocaleTranslations = Record<LocaleTranslationKey, string>;

/**
 * Locale entity
 */
export interface Locale extends Entity {
  /**
   * Two-character language code.
   */
  code: string;

  /**
   * Name of the translation set for organization.
   */
  set: string;

  /**
   * The language key value translations.
   */
  t: LocaleTranslations;
}

/**
 * Locale properties excluding the extended entity properties.
 */
export type LocaleBase = EntityExtension<Locale>;

/**
 * Base properties in order to create a log.
 */
export type LocaleBaseCreate = EntityExtensionCreate<Locale, 'code' | 'set'>;
