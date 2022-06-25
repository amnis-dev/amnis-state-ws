import type { Role } from './auth.types';
import type { Reference } from './core.types';
import { Entity } from './entity.types';
import { Website } from './website.types';

export interface System extends Entity {
  /**
   * Name of the system.
   */
  name: string;

  /**
   * Number in minutes that an authentication session should live.
   * @default 60
   */
  sessionExpires: number;

  /**
   * System's website configurations.
   */
  $website: Reference<Website>;

  /**
   * The initial roles to assign to a user when a new account is created.
   * @default []
   */
  $initialRoles: Reference<Role>[];
}
