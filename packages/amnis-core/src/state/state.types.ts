/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reference } from '../types.js';
import type { Entity } from '../entity/index.js';

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
   */
  start?: number;

  /**
   * Limit results of the query.
   */
  limit?: number;
}

export type Query = {
  /**
    * Query of keys.
    */
  $query?: { [key: string]: Filter };

  /**
   * Range of query.
   */
  $range?: Range;

  /**
   * Depth to query for other referenced entities.
   * @default 0
   * @minimum 0
   * @multipleOf 1
   */
  $depth?: number;
};

/**
  * A common stateful result from API.
  */
export type Result = any;

/**
  * A common stateful result from creations.
  * A state object with entities that were created.
  */
export type StateCreate = State<Entity[]>;

/**
  * A query object to search for entities.
  */
export type StateQuery = State<Query>;

/**
  * A common stateful result from updates.
  * A state object with parial entities to update.
  */
export type StateUpdateEntity = { $id: Entity['$id'] } & Record<string, unknown>;
export type StateUpdate = State<StateUpdateEntity[]>;

/**
  * A common stateful result from deletions.
  * A state object with delete ids.
  */
export type StateDelete = State<Reference[]>;

/**
  * ID Remappings.
  */
export type ReID = [Reference, Reference];

export type ResultReID = State<ReID[]>;
