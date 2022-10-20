/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { Store } from '@reduxjs/toolkit/index.js';

import type { DateJSON } from '../types.js';
import type { JWTDecoded, JWTEncoded, Token } from '../token/index.js';
import type { LogBaseCreate } from '../log/index.js';

import type { Database } from '../db.types.js';
import type { Session } from '../session/index.js';

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
  store: Store;
  database: Database;
  validators: Validators;
}

/**
 * Input interface.
 */
export interface IoInput<T = any> {
  /**
   * The input body.
   */
  body: T;

  /**
   * Encoded JWT data.
   */
  jwtEncoded?: JWTEncoded;

  /**
   * Verified decoded token data.
   */
  jwt?: JWTDecoded;

  /**
   * Encoded Session
   */
  sessionEncoded?: JWTEncoded;

  /**
   * Verified decoded session data.
   */
  session?: Session;
}

/**
 * Output JSON data.
 */
export interface IoOutputJson<T = any> {
  /**
   * Return logs.
   */
  logs: LogBaseCreate[];

  /**
   * Result data.
   */
  result?: T;

  /**
   * Session expiration date-time.
   */
  expire?: DateJSON;

  /**
   * Possible tokens.
   */
  tokens?: Token[];
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
export type Io<Body = any, Result = any> = (
  input: IoInput<Body>,
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
export type IoMiddleware<P = void> = (params: P) => (next: IoProcess) => IoProcess;
