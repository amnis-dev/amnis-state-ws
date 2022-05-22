/**
 * Unique reference symbol to define a reference of a specific type.
 */
declare const dateSymbol: unique symbol;

/**
 * A string that represents a JSON Date.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DateJSON = string & {[dateSymbol]: never};
