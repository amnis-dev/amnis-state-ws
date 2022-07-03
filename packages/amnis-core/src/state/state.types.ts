/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reference } from '../types';
import type { Entity, EntityExtension } from '../entity';

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
  * Select range
  */
export type Range = {
  /**
    * Start query at record value.
    */
  _start?: number;

  /**
     * Limit results of the query.
     */
  _limit?: number;
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
};

/**
  * A definition to insert new data.
  */
export type Insert = State<any[]>;

/**
  * A selector definition object.
  */
export type Select = State<Query>;

/**
  * A definition to modify data.
  */
export type Modify = State<any[]>;

/**
  * A removal definition object.
  */
export type Remove = State<Reference[]>;

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
  * A common stateful result from readings.
  * A state object with entities read from a source.
  */
export type StateRead = State<Entity[]>;

/**
  * A common stateful result from updates.
  * A state object with parial entities to update.
  */
export type UpdateEntity = { $id: Entity['$id'] } & Record<string, unknown>;
export type StateUpdate = State<UpdateEntity[]>;

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
