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
   * Number in milliseconds that an authentication session should live.
   * @default 3600000
   */
  sessionExpires: number;

  /**
   * Optional domain id to reference this system.
   */
  domain?: string;

  /**
   * System's website configurations.
   */
  $website: Reference<Website>;

  /**
   * Role identifier that considers the user an administrator.
   */
  $adminRole: Reference<Role>;

  /**
   * The initial roles to assign to a user when a new account is created.
   * @default []
   */
  $initialRoles: Reference<Role>[];
}
