/**
 * Unique reference symbols for core types.
 */
declare const referenceSymbol: unique symbol;
declare const sliceKeySymbol: unique symbol;
declare const dateSymbol: unique symbol;
declare const surlSymbol: unique symbol;

/**
   * A id reference to another document.
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Reference<T = unknown> = string & {[referenceSymbol]: never};

/**
 * A key string for a Redux slice.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type SliceKey = string & {[sliceKeySymbol]: never};

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
  * A string that represents a URL.
  * Named SURL (String URL) so it's not confused with the URL object type.
  */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type SURL = string & {[surlSymbol]: never};
