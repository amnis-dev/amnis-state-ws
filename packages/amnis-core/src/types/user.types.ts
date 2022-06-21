import type { Reference } from './core.types';
import type { Entity } from './entity.types';
import type { CoreRole, Permit } from './auth.types';

/**
 * Data associated to a CoreUser.
 */
export interface CoreUser extends Entity {
  /**
   * Name for the user.
   * @default ""
   */
  name: string;

  /**
   * Email address
   */
  email?: string;

  /**
   * If the user email is verified.
   */
  emailVerified?: boolean;

  /**
   * Phone number
   */
  phone?: string;

  /**
   * If the user phone number is verified.
   */
  phoneVerified?: boolean;

  /**
   * CoreUser password.
   * A null password means another form of auth must be used.
   * @default null
   */
  password: string | null;

  /**
   * The domain this uer belongs to.
   */
  domain?: string;

  /**
   * If this is an administrative account.
   */
  admin?: boolean;

  /**
   * Roles this user has been given.
   */
  readonly $roles: Reference<CoreRole>[];

  /**
   * Special-case permits this user has been bestowed.
   */
  readonly $permits: Reference<Permit>[];
}
