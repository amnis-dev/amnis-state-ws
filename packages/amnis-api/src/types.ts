/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { DateJSON } from '@amnis/core/types.js';
import type { JWTDecoded, JWTEncoded, Token } from '@amnis/core/token/index.js';
import type { LogBaseCreate } from '@amnis/core/log/index.js';

import type { Database } from '@amnis/core/database.types.js';
import type { Store } from '@reduxjs/toolkit/index.js';
import type { AnyValidateFunction } from 'ajv/dist/types';
import type { Session } from '@amnis/core/session/index.js';

/**
 * Validator mapping.
 */
export type Validators = Record<string, AnyValidateFunction>;

/**
 * API Context for accessing the server store, database, and storage system.
 */
export interface ApiContext {
  store: Store;
  database: Database;
  validators: Validators;
}

/**
 * API input interface.
 */
export interface ApiInput<T = any> {
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
 * Api JSON data.
 */
export interface ApiJSON<T = any> {
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
 * API output interface.
 */
export interface ApiOutput<T = any> {
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
  json: ApiJSON<T>;
}

/**
 * API request query.
 */
export type ApiQuery<
  P = any
> = (payload: P) => FetchArgs

/**
 * API object containing request queries.
 */
export interface ApiQueries {
  [key: string]: ApiQuery;
}

/**
 * API handler for a request.
 */
export type ApiIO<Body = any, Result = any> = (
  input: ApiInput<Body>,
) => Promise<ApiOutput<Result>>;

/**
 * A function that supplies context to a process.
 */
export type ApiProcess<P extends ApiIO = ApiIO> = (context: ApiContext) => P;

/**
 * API object containing response handlers.
 */
export type ApiProcesses = Record<string, ApiProcess>;

/**
 * Object mapping of ApiIOs.
 */
export type ApiIOs<K extends keyof any = keyof any> = Record<K, ApiIO>;

/**
 * RTK Error type.
 */
export type ApiBaseQueryFn = BaseQueryFn<
string | FetchArgs,
unknown,
{ data: ApiJSON, status: number }
>

/**
 * A middlware function.
 */
export type ApiMiddleware<P = void> = (params: P) => (next: ApiProcess) => ApiProcess;
