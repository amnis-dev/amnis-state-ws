import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';
import type { Grant } from '../../state/index.js';
import type { UID } from '../../types.js';

/**
 * Role limits
 */
export type RoleFsLimits = [other: number, image: number, video: number];

/**
 * A license is a defined object for granting multiple permissions to perform actions or selections.
 */
export interface Role extends EntityCreator {
  /**
  * Name of the license.
  */
  name: string;

  /**
   * A brief description of the license.
   */
  description: string;

  /**
   * Color that represents this role.
   */
  color: string;

  /**
   * file upload limits in kilobytes.
   */
  fsLimits: RoleFsLimits;

  /**
   * Permissions this license grants.
   */
  grants: Grant[];
}

/**
 * Profile properties excluding the extended entity properties.
 */
export type RoleBase = EntityCreatorBase<Role>;

/**
   * Base properties.
   */
export type RoleCreator = EntityCreatorParams<Role, 'name'>;

/**
 * A role combination.
 */
export type RoleCombo = [string, UID<Role>[], Grant[]];
