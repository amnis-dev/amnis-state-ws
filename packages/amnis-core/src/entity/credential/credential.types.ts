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
   * The IP address used to register the credential
   */
  ip: string;

  /**
   * Credential's public key for verifying signatures.
   */
  publicKey: string;
}

/**
 * Base object without a generated identifier.
 */
export type CredentialBase = EntityCreatorBase<Credential>;

/**
 * Minimal parameters for creation.
 */
export type CredentialCreator = EntityCreatorParams<Credential, 'ip' | 'name' | 'publicKey'>;
