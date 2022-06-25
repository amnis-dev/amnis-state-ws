import type { Reference } from '../types';
import type { Entity } from '../entity/entity.types';
import type { State } from '../state';
import type { GrantScope, GrantString } from '../grant';

/**
 * A stateful mapping of data access scopes.
 */
export type AuthScope = State<GrantScope>;

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
 * A permit is a list of grants for a specific reference ID.
 */
export interface Permit extends Entity {
  /**
   * Reference to the entity that issued this permit.
   */
  $issuer: Reference;

  /**
   * Owner of the permit that can perform the granted actions.
   */
  $holder: Reference;

  /**
   * Reference to the entity that the owner has been granted actions on.
   */
  $target: Reference;

  /**
   * Grants this permit provides.
   */
  grants: GrantString[];
}
