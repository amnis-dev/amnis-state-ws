/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { Store } from '@reduxjs/toolkit';

import type {
  Bearer, Challenge, Otp, StateScope,
} from '../state/index.js';
import type { LogCreator, Session, Credential } from '../entity/index.js';

import type { Database } from './database/database.types.js';
import type { Filesystem } from './filesystem/filesystem.types.js';
import { Crypto } from './crypto/crypto.types.js';
import { JWTAccess } from '../jwt.types.js';
import { Send } from './send/send.types.js';

/**
 * Validator
 */
export interface Validator<T = any> {
  (this: any, data: any, dataCxt?: any): data is T;
  [key: string]: any;
}

/**
 * Validator mapping.
 */
export type Validators = Record<string, Validator>;

/**
 * API Context for accessing the server store, database, and storage system.
 */
export interface IoContext {
  /**
   * Predicable application state.
   */
  store: Store;

  /**
   * Interface for storing structured data.
   */
  database: Database;

  /**
   * Interface for managing unstructured file data.
   */
  filesystem: Filesystem;

  /**
   * Interface for cryptographic functions.
   */
  crypto: Crypto;

  /**
   * An interface for sending messages to external systems.
   */
  send: Send;

  /**
   * Schemas for validating input structures.
   */
  validators: Validators;
}

/**
 * Input interface.
 */
export interface IoInput<T = any, J = JWTAccess> {
  /**
   * The input body.
   */
  body: T;

  /**
   * Encoded JWT data.
   */
  accessEncoded?: string;

  /**
   * Verified decoded token.
   */
  access?: J;

  /**
   * Ecrypted Session
   */
  sessionEncrypted?: string;

  /**
   * Decrypted session data.
   */
  session?: Session;

  /**
   * Encoded challenge data.
   */
  challengeEncoded?: string;

  /**
   * Decoded challenge object.
   */
  challenge?: Challenge;

  /**
   * Encoded challenge data.
   */
  otpEncoded?: string;

  /**
   * Decoded challenge object.
   */
  otp?: Otp;

  /**
   * Encoded signature data.
   */
  signatureEncoded?: string;

  /**
   * Decoded signature buffer.
   */
  signature?: ArrayBuffer;

  /**
   * The current credential.
   */
  credential?: Credential;

  /**
   * Possible IP address
   */
  ip?: string;

  /**
   * Scope for database searches.
   */
  scope?: StateScope;
}

/**
 * Output JSON data.
 */
export interface IoOutputJson<T = any> {
  /**
   * Return logs.
   */
  logs: LogCreator[];

  /**
   * Result data.
   */
  result?: T;

  /**
   * Possible bearers.
   */
  bearers?: Bearer[];
}

/**
 * Output interface.
 */
export interface IoOutput<T = any> {
  /**
   * Status
   */
  status: number;

  /**
   * Repsonse cookies.
   */
  cookies: Record<string, string | undefined>;

  /**
   * JSON data on the response object.
   */
  json: IoOutputJson<T>;
}

/**
 * Request query for an IO.
 */
export type IoQuery<
  P = any
> = (payload: P) => FetchArgs

/**
 * Object containing IO request queries.
 */
export interface IoQueries {
  [key: string]: IoQuery;
}

/**
 * Primary input and output type for processing
 */
export type Io<Body = any, Result = any, Token = JWTAccess> = (
  input: IoInput<Body, Token>,
  output: IoOutput<Result>
) => Promise<IoOutput<Result>>;

/**
 * A function that supplies context to a process.
 */
export type IoProcess<P extends Io = Io> = (context: IoContext) => P;

/**
  * Object containing IO processors.
  */
export type IoProcesses = Record<string, IoProcess>;

/**
 * Object mapping of IO.
 */
export type IoMap<K extends keyof any = keyof any> = Record<K, Io>;

/**
 * RTK Error type.
 */
export type IoBaseQueryFn = BaseQueryFn<
string | FetchArgs,
unknown,
{ data: IoOutputJson, status: number }
>

/**
 * A middlware function.
 */
export type IoMiddleware<P = void, IP extends IoProcess = IoProcess> =
  (params: P) => (next: IP) => IP;
