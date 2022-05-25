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
 * Unique reference symbol to a group identifier.
 */
declare const groupSymbol: unique symbol;

/**
 * A id reference to another document.
 */
export type Group = string & {[groupSymbol]: never};

/**
 * Unique reference symbol to define a reference of a specific type.
 */
declare const dateSymbol: unique symbol;

/**
 * A string that represents a JSON Date.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DateJSON = string & {[dateSymbol]: never};
