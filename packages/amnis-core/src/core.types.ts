/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type Select = Record<string, Query>;
