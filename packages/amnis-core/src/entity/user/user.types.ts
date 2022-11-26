import type { UIDList } from '../../types.js';
import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity.types.js';
import type { Permit } from '../permit/index.js';
import type { DeviceString } from '../device/index.js';
import type { Role } from '../role/index.js';

/**
 * Data associated to a User.
 */
export interface User extends Entity {
  /**
   * Name for the user.
   * @minLength 3
   * @maxLength 64
   */
  name: string;

  /**
   * User's public key for verifying signatures.
   */
  publicKey?: JsonWebKey;

  /**
   * Email address
   * @pattern ^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$
   * @maxLength 64
   * @errorMessage "There was an email error"
   */
  email?: string;

  /**
   * If the user email is verified.
   */
  emailVerified?: boolean;

  /**
   * Phone number
   * @maxLength 24
   */
  phone?: string;

  /**
   * If the user phone number is verified.
   */
  phoneVerified?: boolean;

  /**
   * User password.
   * A null password means another form of auth must be used.
   * @minLength 6
   * @maxLength 64
   */
  password?: string;

  /**
   * If this is an administrative account.
   */
  admin?: boolean;

  /**
   * Devices this user signs in with.
   * @default []
   */
  devices: DeviceString[];

  /**
   * Roles this user has been given.
   * @default []
   */
  readonly $roles: UIDList<Role>;

  /**
   * Special-case permits this user has been bestowed.
   * @default []
   */
  readonly $permits: UIDList<Permit>;
}

/**
 * User properties excluding the extended entity properties.
 */
export type UserBase = EntityExtension<User>;

/**
  * User base properties for creation.
  */
export type UserBaseCreate = EntityExtensionCreate<User, 'name'>;