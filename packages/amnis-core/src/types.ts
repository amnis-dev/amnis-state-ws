/**
 * Unique identifier symbols for core types.
 */
declare const identifierSymbol: unique symbol;
declare const identifierListSymbol: unique symbol;
declare const identifierTreeSymbol: unique symbol;
declare const dateSymbol: unique symbol;
declare const surlSymbol: unique symbol;

/**
    * A id identifier to another document.
    */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type UID<T = unknown> = string & {[identifierSymbol]: never};

/**
 * An array of identifiers.
 */
export type UIDList<T = unknown> = UID<T>[] & {[identifierListSymbol]: never};

/**
 * A record that links indentifiers in directory tree fashion.
 */
export type UIDTree<T = unknown> =
  [UID<T>, UID<T> | null][] & {[identifierTreeSymbol]: never};

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
