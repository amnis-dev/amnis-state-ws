import type { Role } from '../role/index.js';
import type { UID, UIDList } from '../../types.js';
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';
import type { Website } from '../website/index.js';

export interface System extends EntityCreator {
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
   * Administrators have complete control.
   */
  $adminRole: UID<Role>;

  /**
   * Role identifier that considers the user an executive.
   * Executives have second-highest control over a system, just under administrators.
   */
  $execRole: UID<Role>;

  /**
   * The initial roles to assign to a user when a new account is created.
   * @default []
   */
  $initialRoles: UIDList<Role>;

  /**
   * Anonymous access permissions.
   * These are roles used when no authotization is provided by the client.
   * @default []
   */
  $anonymousRoles: UIDList<Role>;
}

/**
 * System properties excluding the extended entity properties.
 */
export type SystemBase = EntityCreatorBase<System>;

/**
 * System base properties for creation.
 */
export type SystemCreator = EntityCreatorParams<System, 'name' | '$adminRole' | '$execRole'>;
