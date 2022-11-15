import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity/index.js';

/**
 * Encryption entity
 */
export interface Encryption extends Entity {
  /**
   * Human friendly name of the cyptographic key
   */
  name: string;

  /**
   * A unique tag name that identifies this encryption.
   */
  tag: string;

  /**
   * Type of encryption used.
   */
  type: 'rsa' | 'aes';

  /**
   * Value of the encryption
   */
  value: string;
}

/**
 * Crypto properties excluding the extended entity properties.
 */
export type EncryptionBase = EntityExtension<Encryption>;

/**
 * Base properties in order to create a log.
 */
export type EncryptionBaseCreate = EntityExtensionCreate<Encryption, 'name' | 'tag' | 'value'>;
