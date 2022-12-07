import type { Role } from '../role/index.js';
import type { UID, UIDList } from '../../types.js';
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';
import type { Website } from '../website/index.js';

export interface System extends EntityCreator {
  /**
   * @description Name of the system.
   */
  name: string;

  /**
   * @description Number in minutes that an authentication session should live.
   * @default 60
   */
  sessionExpires: number;

  /**
   * @description Number in minutes that a bearer token should live.
   * @default 30
   */
  bearerExpires: number;

  /**
   * @description Open registration to anonymous users. Otherwise, only executives and
   * admins can initialize a registration for a new client.
   * @default true
   */
  registrationOpen: boolean;

  /**
   * @description Expiration of a registration event in minutes.
   * @default 30
   */
  registrationExpiration: number;

  /**
   * @description System's website configurations.
   */
  $website: UID<Website>;

  /**
   * @description Role identifier that considers the user an administrator.
   * Administrators have complete control.
   */
  $adminRole: UID<Role>;

  /**
   * @description Role identifier that considers the user an executive.
   * Executives have second-highest control over a system, just under administrators.
   */
  $execRole: UID<Role>;

  /**
   * @description The initial roles to assign to a user when a new account is created.
   * @default []
   */
  $initialRoles: UIDList<Role>;

  /**
   * @description Anonymous access permissions.
   * These are roles used when no authorization is provided by the client.
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
