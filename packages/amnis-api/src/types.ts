/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/dist/query';
import type {
  DateJSON, JWTDecoded, Reference,
} from '@amnis/core/index';

/**
 * An API error repsonse.
 */
export interface ApiError {
  title: string;
  message: string | null;
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
   * Verified token data.
   */
  jwt?: JWTDecoded;
}

/**
 * Api JSON data.
 */
export interface ApiJSON<T = any> {
  /**
   * Possible error details.
   */
  errors: ApiError[];

  /**
   * Result data.
   */
  result?: T;

  /**
   * Possible id remapping.
   */
  remaps?: Record<string, Record<Reference, Reference>>;

  /**
   * CoreSession expiration date-time.
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
  input: ApiInput<Body>
) => Promise<ApiOutput<Result>>

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
