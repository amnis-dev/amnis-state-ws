import type { Reference } from './core.types';
import type { Entity } from './entity.types';
import type { Role, Permit } from './auth.types';

/**
 * Data associated to a User.
 */
export interface User extends Entity {
  /**
   * Name for the user.
   * @default ""
   */
  name: string;

  /**
   * Email address
   * @default ""
   */
  email: string;

  /**
   * User password.
   * A null password means another form of auth must be used.
   * @default null
   */
  password: string | null;

  /**
   * Roles this user has been given.
   */
  readonly $roles: Reference<Role>[];

  /**
   * Special-case permits this user has been bestowed.
   */
  readonly $permits: Reference<Permit>[];
}
