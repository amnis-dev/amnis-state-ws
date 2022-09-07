import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity';
import type { GrantString } from '../grant';

/**
 * A license is a defined object for granting multiple permissions to perform actions or selections.
 */
export interface Role extends Entity {
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
export type RoleBase = EntityExtension<Role>;

/**
   * Base properties.
   */
export type RoleBaseCreate = EntityExtensionCreate<Role, 'name'>;
