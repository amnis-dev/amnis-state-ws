import type { Role } from '../role';
import type { Reference } from '../types';
import type { Entity } from '../entity';
import type { Website } from '../website';

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
