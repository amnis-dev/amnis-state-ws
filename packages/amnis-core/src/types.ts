/**
 * Unique identifier symbols for core types.
 */
declare const referenceSymbol: unique symbol;
declare const dateSymbol: unique symbol;
declare const surlSymbol: unique symbol;

/**
    * A id identifier to another document.
    */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Identifier<T = unknown> = string & {[referenceSymbol]: never};

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
