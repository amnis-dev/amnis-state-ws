import type { Role } from '../role/index.js';
import type { UID } from '../types.js';
import type { Entity } from '../entity/index.js';
import type { Website } from '../website/index.js';

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
   * System's website configurations.
   */
  $website: UID<Website>;

  /**
   * Role identifier that considers the user an administrator.
   */
  $adminRole: UID<Role>;

  /**
   * The initial roles to assign to a user when a new account is created.
   * @default []
   */
  $initialRoles: UID<Role>[];
}
