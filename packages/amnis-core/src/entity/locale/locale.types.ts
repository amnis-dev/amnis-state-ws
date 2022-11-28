import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity.types.js';

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
export type LocaleTranslation = Record<LocaleTranslationKey, string>;

/**
 * Locale entity
 */
export interface Locale extends Entity {
  /**
   * Two-character language code.
   * @minLength 2
   * @maxLength 2
   */
  code: string;

  /**
   * Name of the translation set for organization.
   * @minLength 1
   * @maxLength 32
   */
  set: string;

  /**
   * The language key value translations.
   */
  t: LocaleTranslation;

  /**
   * Variables that can be inserted into translation text.
   */
  v: string[],
}

/**
 * Locale properties excluding the extended entity properties.
 */
export type LocaleBase = EntityExtension<Locale>;

/**
 * Base properties in order to create a log.
 */
export type LocaleCreator = EntityExtensionCreate<Locale, 'code' | 'set'>;
