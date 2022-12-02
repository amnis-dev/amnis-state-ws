import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';
import type { GrantString } from '../../state/index.js';

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
   * Permissions this license grants.
   */
  grants: GrantString[];
}

/**
 * Profile properties excluding the extended entity properties.
 */
export type RoleBase = EntityCreatorBase<Role>;

/**
   * Base properties.
   */
export type RoleCreator = EntityCreatorParams<Role, 'name'>;
