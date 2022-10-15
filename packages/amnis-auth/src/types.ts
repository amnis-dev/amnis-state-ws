/* eslint-disable no-shadow */
import type { KeyPairSyncResult } from 'node:crypto';
import type { GrantScope } from '@amnis/core/grant/index.js';
import type { State } from '@amnis/core/state/index.js';

/**
 * Unique identifier symbols and types for RSA
 */
export enum PrivateKeyNominal { _ = '' }
export enum PublicKeyNominal { _ = '' }
export type PrivateKey = PrivateKeyNominal & string;
export type PublicKey = PublicKeyNominal & string;

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
export enum SHA256Nominal { _ = '' }

/**
 * String representation of a SHA256 encoded string.
 */
export type SHA256 = SHA256Nominal & string;

/**
 * Unique identifier symbol for an SHA256 cipher encryption string.
 */
export enum AES256Nominal { _ = '' }

/**
 * String representation of a SHA256 cipher encryption string.
 */
export type AES256 = AES256Nominal & string;
