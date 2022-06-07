/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reference } from './core.types';
import type { Entity } from './entity.types';

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
export type UpdateEntity = { $id: string } & Partial<Entity>;
export type ResultUpdate = State<UpdateEntity[]>;

/**
 * A common stateful result from deletions.
 * A state object with delete ids.
 */
export type ResultDelete = State<string[]>;
