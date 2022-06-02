import type { Reference } from './core.types';
import type { Entity } from './entity.types';
import type { Role, Permit } from './auth.types';

/**
 * Data associated to a User.
 */
export interface User extends Entity {
  /**
   * Name for the user.
   */
  name: string;

  /**
   * Email address
   * @default ""
   */
  email: string;

  /**
   * Roles this user has been given.
   */
  readonly $roles: Reference<Role>[];

  /**
   * Special-case permits this user has been bestowed.
   */
  readonly $permits: Reference<Permit>[];
}
