import type { DateJSON } from '../../types.js';
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';

/**
 * Entity that contains data to verify credentials.
 */
export interface Credential extends EntityCreator {
  /**
   * Name of the credential
   */
  name: string;

  /**
   * Credential's public key for verifying signatures.
   */
  publicKey: string;

  /**
   * The IP address when the credential was registered.
   */
  ip?: string;

  /**
   * Date-time of when the credential was last used.
   */
  used?: DateJSON
}

/**
 * Base object without a generated identifier.
 */
export type CredentialBase = EntityCreatorBase<Credential>;

/**
 * Minimal parameters for creation.
 */
export type CredentialCreator = EntityCreatorParams<Credential, 'ip' | 'name' | 'publicKey'>;
