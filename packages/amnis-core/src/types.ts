/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
/**
 * Unique identifier symbols for core types.
 */
export enum UIDNominal { _ = '' }
export enum DateNominal { _ = '' }
export enum SURLNominal { _ = '' }

/**
 * A id identifier to another document.
 *
 * @pattern ^[a-z]{1,24}:[A-Za-z0-9_-]{16,32}$
 * @minLength 18
 * @maxLength 56
 */
export type UID<T = unknown> = UIDNominal & string;

/**
 * List of identifiers.
 */
export type UIDList<T = unknown> = UID<T>[];

/**
 * Identifiers linked in a directory tree fashion.
 */
export type UIDTree<T = unknown> = [UID<T>, UID<T> | null][];

/**
 * A string that represents a JSON Date.
 *
 * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$
 */
export type DateJSON = DateNominal & string;

/**
 * A string that represents a JSON Date.
 *
 * @min 0
 */
export type DateNumeric = DateNominal & number;

/**
 * A string that represents a URL.
 * Named SURL (String URL) so it's not confused with the URL object type.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type SURL = SURLNominal & string;

/**
 * An email address
 *
 * @pattern ^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$
 * @maxLength 64
 * @errorMessage "The email address is poorly formatted"
 */
export type Email = string;

/**
 * A clear-text password.
 *
 * @minLength 4
 * @maxLength 32
 */
export type Password = string;

/**
 * An encoded challenge to prevent replay attacks.
 *
 * @minLength 16
 * @maxLength 512
 */
export type ChallengeEncoded = string;

/**
 * An encoded cryptographic signature to verify that data can be trusted.
 *
 * @minLength 16
 * @maxLength 512
 */
export type SignatureEncoded = string;
