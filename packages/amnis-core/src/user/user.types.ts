import type { Reference } from '../types';
import type { Entity } from '../entity';
import type { Permit } from '../permit';
import type { DeviceString } from '../device';
import type { Role } from '../role';

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
   * @default null
   */
  password: string | null;

  /**
   * The domain this user belongs to.
   */
  domain?: string;

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
  readonly $roles: Reference<Role>[];

  /**
   * Special-case permits this user has been bestowed.
   * @default []
   */
  readonly $permits: Reference<Permit>[];
}
