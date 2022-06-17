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
   * @default ""
   */
  email: string;

  /**
   * CoreUser password.
   * A null password means another form of auth must be used.
   * @default null
   */
  password: string | null;

  /**
   * Organization this order belongs to.
   */
  organization?: string;

  /**
   * Roles this user has been given.
   */
  readonly $roles: Reference<CoreRole>[];

  /**
   * Special-case permits this user has been bestowed.
   */
  readonly $permits: Reference<Permit>[];
}
