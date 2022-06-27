/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { DateJSON } from '@amnis/core/index';
import type { JWTDecoded, JWTEncoded } from '@amnis/core/token';
import type { Log, LogBaseCreate } from '@amnis/core/log';

import type { Database } from '@amnis/db/index';
import type { Store } from '@reduxjs/toolkit';
import type { AnyValidateFunction } from 'ajv/dist/types';
import { apiOutput } from './api';

/**
 * API Context for accessing the server store, database, and storage system.
 */
export interface ApiContext {
  store: Store;
  database: Database;
  validator?: AnyValidateFunction;
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
  cookies: Record<string, string>;

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
export type ApiProcess<Body = any, Result = any> = (
  input: ApiInput<Body>,
) => Promise<ApiOutput<Result>>;

/**
 * A function that supplies context to a process.
 */
export type ApiContextMethod = (context: ApiContext) => ApiProcess;

/**
 * API object containing response handlers.
 */
export type ApiProcesses = Record<string, ApiProcess>;

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
export type ApiMiddleware =
  (next: ApiContextMethod) =>
  (context: ApiContext) =>
  (input: ApiInput) => Promise<ApiOutput>;
