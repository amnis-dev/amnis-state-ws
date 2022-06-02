/**
 * Unique reference symbols for core types.
 */
declare const referenceSymbol: unique symbol;
declare const dateSymbol: unique symbol;
declare const urlSymbol: unique symbol;

/**
   * A id reference to another document.
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Reference<T = unknown> = string & {[referenceSymbol]: never};

/**
  * A string that represents a JSON Date.
  */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DateJSON = string & {[dateSymbol]: never};

/**
  * A string that represents a JSON Date.
  */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DateNumeric = number & {[dateSymbol]: never};

/**
  * A string that represents a URL
  */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type URL = string & {[urlSymbol]: never};
