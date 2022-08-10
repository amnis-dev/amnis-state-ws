import type { Entity } from '../entity/index.js';
import type { GrantString } from '../grant/index.js';

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
