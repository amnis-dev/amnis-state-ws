import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';

export interface Device extends EntityCreator {
  /**
   * IP address of the device.
   */
  ip: string;

  /**
   * Name of the device.
   */
  name: string;

  /**
   * Device's public key for verifying signatures.
   */
  publicKey: string;
}

/**
 * Base object without a generated identifier.
 */
export type DeviceBase = EntityCreatorBase<Device>;

/**
 * Minimal parameters for creation.
 */
export type DeviceCreator = EntityCreatorParams<Device, 'ip' | 'name' | 'publicKey'>;
