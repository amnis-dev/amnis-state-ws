/* eslint-disable no-shadow */
import type { KeyPairSyncResult } from 'node:crypto';
import type { GrantScope } from '@amnis/core/grant';
import type { State } from '@amnis/core/state';

/**
 * Unique identifier symbols and types for RSA
 */
enum PrivateKeyBrand { _ = '' }
enum PublicKeyBrand { _ = '' }
export type PrivateKey = PrivateKeyBrand & string;
export type PublicKey = PublicKeyBrand & string;

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
 * Unique identifier symbol for an SHA256 hashed string.
 */
enum SHA256Brand { _ = '' }

/**
 * String representation of a SHA256 encoded string.
 */
export type SHA256 = SHA256Brand & string;

/**
 * Unique identifier symbol for an SHA256 cipher encryption string.
 */
enum AES256Brand { _ = '' }

/**
 * String representation of a SHA256 cipher encryption string.
 */
export type AES256 = AES256Brand & string;
