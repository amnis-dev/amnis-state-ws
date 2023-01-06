import type {
  DateJSON, Encoding, IP, Name,
} from '../../types.js';
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';

/**
 * Entity that contains data to verify credentials.
 */
export interface Credential extends EntityCreator {
  /**
   * Name of the credential
   */
  name: Name;

  /**
   * Credential's public key for verifying signatures.
   */
  publicKey: Encoding;

  /**
   * The IP address when the credential was registered.
   */
  ip?: IP;

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
