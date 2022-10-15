import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity/index.js';

/**
 * Crypto entity
 */
export interface Crypto extends Entity {
  /**
   * Human friendly name of the cyptographic key
   */
  name: string;

  /**
   * A unique tag name that identifies this public key.
   */
  tag: string;

  /**
   * Type of cyptographic key.
   */
  type: 'rsa';

  /**
   * Always the public side of the key pair.
   */
  pair: 'public';

  /**
   * Value of the cyptographic key
   */
  value: string;
}

/**
 * Crypto properties excluding the extended entity properties.
 */
export type CryptoBase = EntityExtension<Crypto>;

/**
 * Base properties in order to create a log.
 */
export type CryptoBaseCreate = EntityExtensionCreate<Crypto, 'name' | 'tag' | 'pair' | 'value'>;
