import type { DateJSON, Email, UIDList } from '../../types.js';
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';
import type { Permit } from '../permit/index.js';
import type { Credential } from '../credential/index.js';
import type { Role } from '../role/index.js';

/**
 * Data associated to a User.
 */
export interface User extends EntityCreator {
  /**
   * Name for the user.
   * @minLength 3
   * @maxLength 32
   */
  name: string;

  /**
   * A hashed value of the users password.
   * @minLength 16
   * @maxLength 512
   */
  password?: string;

  /**
   * If this account is locked from being authenticated.
   * @default false
   */
  locked: boolean;

  /**
   * Email address for user account related purposes.
   */
  email?: Email;

  /**
   * If the user email is verified.
   */
  emailVerified?: boolean;

  /**
   * Phone number for user account related purposes.
   * @maxLength 24
   */
  phone?: string;

  /**
   * If the user phone number is verified.
   */
  phoneVerified?: boolean;

  /**
   * If this is an administrative account.
   */
  admin?: boolean;

  /**
   * Date-time of last login.
   */
  logged?: DateJSON;

  /**
   * Credentials this user has registered.
   * @default []
   */
  $credentials: UIDList<Credential>;

  /**
   * Roles this user has been given.
   * @default []
   */
  $roles: UIDList<Role>;

  /**
   * Special-case permits this user has been bestowed.
   * @default []
   */
  $permits: UIDList<Permit>;
}

/**
 * User properties excluding the extended entity properties.
 */
export type UserBase = EntityCreatorBase<User>;

/**
  * User base properties for creation.
  */
export type UserCreator = EntityCreatorParams<User, 'name'>;
