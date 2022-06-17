import type { Reference } from './core.types';
import type { Entity } from './entity.types';
import { State } from './state.types';

/**
 * Data scopes.
 */
export type DataScope = 'global' | 'owned';

/**
  * Data tasks.
  */
// eslint-disable-next-line no-shadow
export enum Task {
  None = 0,
  Create = 1,
  Read = 2,
  Update = 4,
  Delete = 8,
}

/**
 * Grant object.
 */
export type Grant = {
  key: string;
  scope: DataScope;
  task: Task;
};

/**
 * CoreRole grant string.
 */
export type GrantString = string;

/**
 * A stateful mapping of data access scopes.
 */
export type AuthScope = State<DataScope>;

/**
 * A license is a defined object for granting multiple permissions to perform actions or selections.
 */
export interface CoreRole extends Entity {
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
