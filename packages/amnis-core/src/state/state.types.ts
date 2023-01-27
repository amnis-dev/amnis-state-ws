/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GrantScope } from './index.js';
import type { UID, UIDList } from '../types.js';
import type { Entity, EntityCreator } from '../entity/index.js';

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

/**
  * StateQuery range
  */
export type Range = {
  /**
   * Start query at record value.
   *
   * @minimum 0
   * @maximum 4096
   * @multipleOf 1
   */
  start?: number;

  /**
   * Limit results of the query.
   *
   * @minimum 0
   * @maximum 64
   * @multipleOf 1
   */
  limit?: number;
}

export type QueryProps = {
  [key: string]: Filter
};

export type Query = {
  /**
    * Query of keys.
    */
  $query?: QueryProps;

  /**
   * Range of query.
   */
  $range?: Range;

  /**
   * Depth to query for other referenced entities.
   *
   * @minimum 0
   * @maximum 3
   * @multipleOf 1
   */
  $depth?: number;
};

/**
  * A common stateful result from API.
  */
export type Result = any;

/**
  * A common stateful result of compelete entities.
  */
export type StateEntities = State<Entity<EntityCreator>[]>;

/**
  * A common stateful result from creations.
  * A state object with entities to be created
  */
export type StateCreator = State<EntityCreator[]>;

/**
  * A query object to search for entities.
  */
export type StateQuery = State<Query>;

/**
  * A common stateful result from updates.
  * A state object with parial entities to update.
  */
export type StateUpdateEntity = { $id: EntityCreator['$id'] } & Record<string, unknown>;
export type StateUpdater = State<StateUpdateEntity[]>;

/**
  * A common stateful result from deletions.
  * A state object with delete ids.
  */
export type StateDeleter = State<UIDList>;

/**
  * ID Remappings.
  */
export type ReID = [UID, UID];

export type ResultReID = State<ReID[]>;

/**
 * A stateful mapping of data access scopes.
 */
export type StateScope = State<GrantScope>;
