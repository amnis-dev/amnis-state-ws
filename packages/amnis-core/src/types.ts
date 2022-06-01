/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityState } from '@reduxjs/toolkit';

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
   * Entity that owns this data.
   */
  readonly $owner: Reference;

  /**
   * Possible user id creator of the entity.
   */
  readonly $creator: Reference;

  /**
   * Entities that have updated this.
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
 * An ambiguous state.
 */
export type State<ReducerState = any> = Record<string, ReducerState>;

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
export type Select = State<Query>;

/**
 * A removal definition object.
 */
export type Remove = State<Reference[]>;

/**
 * A common stateful result from API.
 */
export type Result = State;

/**
 * A common stateful result from creations.
 * A state object with entities that were created.
 */
export type ResultCreate = State<Entity[]>;

/**
 * A common stateful result from readings.
 * A state object with entities read from a source.
 */
export type ResultRead = State<Entity[]>;

/**
 * A common stateful result from updates.
 * A state object with parial entities to update.
 */
export type ResultUpdate = State<{ $id: string } & Partial<Entity>[]>;

/**
 * A common stateful result from deletions.
 * A state object with delete ids.
 */
export type ResultDelete = State<string[]>;

/**
 * Data scopes.
 */
export type DataScope = 'global' | 'owned';

/**
  * Data tasks.
  */
// eslint-disable-next-line no-shadow
export enum DataTask {
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
  task: DataTask;
};

/**
 * Boolean flag for gant strings.
 */
export type GrantFlag = '0' | '1';

/**
 * Role grant string.
 */
export type GrantString = string;

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
   * Permissions this license grants.
   */
  grants: GrantString[];
}

/**
 * A permit is a list of grants for a specific reference ID.
 */
export interface Permit extends Entity {
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

/**
 * Data associated to a User.
 */
export interface User extends Entity {
  /**
   * Name for the user.
   */
  name: string;

  /**
   * Email address
   * @default ""
   */
  email: string;

  /**
   * Roles this user has been given.
   */
  readonly $roles: Reference<Role>[];

  /**
   * Special-case permits this user has been bestowed.
   */
  readonly $permits: Reference<Permit>[];
}

/**
 * An interface for sessions.
 */
export interface Session extends Entity {
  /**
   * Name of the session user.
   */
  name: string;

  /**
   * Reference to the User ID
   */
  readonly $user: Reference<User>;

  /**
   * Expiration date-time of the session.
   */
  expires: DateJSON;

  /**
   * Grants this session posesses.
   */
  grants: GrantString[];
}

/**
 * Core interface for database methods.
 */
export interface Database {
  /**
   * Method to implement database initialization.
   */
  initialize: (...params: any[]) => void;

  /**
   * Method for creating new records in the database.
   */
  create: (state: State) => ResultCreate;

  /**
   * Method for updating records in the database.
   */
  update: (state: State) => ResultUpdate;

  /**
   * Method to delete records in the database.
   * Shouldn't actually delete records, but mark them as deleted instead
   */
  delete: (references: State<string[]>) => ResultDelete;

  /**
   * Selects data from the database determined by the select query.
   */
  read: (select: Select) => ResultRead;
}
