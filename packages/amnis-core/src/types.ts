/* eslint-disable no-shadow */
/**
 * Unique identifier symbols for core types.
 */
export enum UIDNominal { _ = '' }
export enum DateNominal { _ = '' }
export enum SURLNominal { _ = '' }

/**
    * A id identifier to another document.
    */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type UID<T = unknown> = UIDNominal & string;

/**
 * An array of identifiers.
 */
export type UIDList<T = unknown> = UID<T>[];

/**
 * A record that links indentifiers in directory tree fashion.
 */
export type UIDTree<T = unknown> = [UID<T>, UID<T> | null][];

/**
 * A string that represents a JSON Date.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DateJSON = DateNominal & string;

/**
 * A string that represents a JSON Date.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DateNumeric = DateNominal & number;

/**
 * A string that represents a URL.
 * Named SURL (String URL) so it's not confused with the URL object type.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type SURL = SURLNominal & string;
