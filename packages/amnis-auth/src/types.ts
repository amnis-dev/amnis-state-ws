import type { KeyPairSyncResult } from 'node:crypto';
import type { GrantScope } from '@amnis/core/grant';
import type { State } from '@amnis/core/state';

/**
 * Unique reference symbols and types for RSA
 */
declare const privateKeySymbol: unique symbol;
declare const publicKeySymbol: unique symbol;
export type PrivateKey = string & {[privateKeySymbol]: never};
export type PublicKey = string & {[publicKeySymbol]: never};

/**
 * Key Pair interface.
 */
export type KeyPair = KeyPairSyncResult<string, string>;

/**
 * Private Key.
 */

/**
 * Public Key.
 */

/**
 * A stateful mapping of data access scopes.
 */
export type AuthScope = State<GrantScope>;

/**
 * Unique reference symbol for an SHA256 hashed string.
 */
declare const sha256Symbol: unique symbol;

/**
 * String representation of a SHA256 encoded string.
 */
export type SHA256 = string & {[sha256Symbol]: never};

/**
 * Unique reference symbol for an SHA256 cipher encryption string.
 */
declare const aes256Symbol: unique symbol;

/**
 * String representation of a SHA256 cipher encryption string.
 */
export type AES256 = string & {[aes256Symbol]: never};
