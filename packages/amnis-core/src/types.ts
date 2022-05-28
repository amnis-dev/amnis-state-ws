/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityState } from '@reduxjs/toolkit';

/**
 * Unique reference symbol to another document type.
 */
declare const referenceSymbol: unique symbol;

/**
  * A id reference to another document.
  */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Reference<T = Record<string, unknown>> = string & {[referenceSymbol]: never};

/**
 * Unique reference symbol to define a reference of a specific type.
 */
declare const dateSymbol: unique symbol;

/**
 * A string that represents a JSON Date.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DateJSON = string & {[dateSymbol]: never};

/**
 * A common entity object.
 * Entity's are serializable (JSON) objects that can be committed to NoSQL Databases.
 */
export interface Entity {
  /**
   * Identifier for this entity.
   * @default ""
   */
  readonly $id: Reference;

  /**
   * Creation date string.
   * @default ""
   */
  readonly created: DateJSON;

  /**
   * Updated date string.
   * @default ""
   */
  updated: DateJSON;

  /**
   * Flag to determine if the entity has been committed to storage.
   * @default false
   */
  committed: boolean;

  /**
   * Possible user id creator of the entity.
   */
  readonly $creator: Reference;

  /**
   * Users that have updated the entity.
   */
  readonly $updaters: Reference[];

  // /**
  //  * Anything that begins with a '$' must be a document reference.
  //  */
  // [key: `$${string}`]: Reference | Reference[];

  // /**
  //  * Properties can only be serializable, normalized, values.
  //  */
  // [key: string]: boolean | number | string | null | undefined | string[];
}

/**
 * Meta information for an entity collection.
 */
export interface Meta<E extends Entity> {
  /**
   * The entity id referencing the active entity.
   */
  active: Reference<E> | null;

  /**
    * The id representing a focused entity.
    */
  focused: Reference<E> | null;

  /**
    * List of ids considered to be selected.
    */
  selection: Reference<E>[];
}

/**
 * Omitted types of the core Entity interface.
 */
export type EntityOmit<E extends Entity> = Omit<E, keyof Entity>

/**
 * Type for creation method
 */
export type EntityExtension<E extends Entity> = EntityOmit<E>;

/**
 * Type for an update method.
 */
export type EntityPartial<E extends Entity> = Partial<EntityExtension<E>>;

/**
 * An entity state.
 */
export type MetaState<E extends Entity> = EntityState<E> & Meta<E>;

/**
 * Types of tasks that can be applied to the state.
 */
export type TaskType = '@action' | '@select';

/**
 * Grant scopes.
 */
export type GrantScope = 'global' | 'owned';

/**
 * Common action types.
 */
export type ActionTask = 'create' | 'update' | 'delete';

/**
 * Common select types.
 */
export type SelectTask = 'all';

/**
 * An ambiguous state.
 */
export type State = Record<string, any>;

/**
 * Filter object for a query.
 */
export interface Filter {
  /**
   * Matches values that are equal to a specified value.
   */
  $eq?: unknown;

  /**
   * Matches values that are greater than a specified value.
   */
  $gt?: number;

  /**
   * Matches values that are greater than or equal to a specified value.
   */
  $gte?: number;

  /**
   * Matches values that are less than a specified value.
   */
  $lt?: number;

  /**
   * Matches values that are less than or equal to a specified value.
   */
  $lte?: number;

  /**
   * Matches any of the values specified in an array.
   */
  $in?: unknown[];
}

export type Query = {
  /**
   * Slice keys.
   */
  [key: string]: Filter;
} & {
  /**
   * Start query at record value.
   */
  $start?: number;
  /**
   * Limit results of the query.
   */
  $limit?: number;
}

/**
 * A selector definition object.
 */
export type Select = Record<string, Query>;

/**
 * A common stateful result from API.
 */
export type Result = Record<string, Entity[]>;

/**
 * Grant
 *
 * Type: 'action' or 'select'
 *   'action' types perform some mutation to the data state.
 *   'select' types fetch information from the data state.
 *
 * Path: The path off of the Root data state that this is granted to.
 *
 * Scope: The range of data that the task can be performed on.
 * Example: All, Owned
 *
 * Task: Name of the task to perform.
 *
 */
export type Grant = {
  type: '@action',
  path: `${string}.${string}`,
  scope: GrantScope,
  task: ActionTask
} | {
  type: '@select',
  path: `${string}.${string}`,
  scope: GrantScope,
  task: SelectTask
}

/**
 * License grant string.
 * Format: @<Type>:<Path>:<Scope>:<Task>
 *
 * @example
 * `@action:user.displayName:global:update`
 */
export type GrantString = (
  `@action:${string}.${string}:${GrantScope}:${ActionTask}` |
  `@select:${string}.${string}:${GrantScope}:${SelectTask}`
);

/**
 * A license is a defined object for granting multiple permissions to perform actions or selections.
 */
export interface License {
  /**
   * Name of the license.
   */
  $name: Reference;

  /**
   * A brief description of the license.
   */
  description: string;

  /**
   * Permissions this license grants.
   */
  grants: Grant[];
}

/**
 * A permit is a list of grants for a specific reference ID.
 */
export type Permit = {
  /**
   * Owner of the permit that can perform the granted actions.
   */
  $owner: Reference;

  /**
   * Reference to the entity that the owner has been granted actions on.
   */
  $entity: Reference;

  /**
   * Grants this permit provides.
   */
  grants: Grant[];
}

/**
 * Data associated to a User.
 */
export interface User extends Entity {
  /**
   * Display name for the user.
   */
  displayName: string;

  /**
   * Licences this user has been given.
   */
  readonly $licenses: Reference<License>[];

  /**
   * Speical-case permits this user has been bestowed.
   */
  readonly $permits: Reference<Permit>[];
}
