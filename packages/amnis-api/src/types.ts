/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Store } from '@reduxjs/toolkit';
import type { FetchArgs } from '@reduxjs/toolkit/dist/query';
import type {
  Result, DateJSON, Database,
} from '@amnis/core/index';
import type { JSONSchemaType, ValidateFunction } from 'ajv';

/**
 * An API error repsonse.
 */
export interface ApiError {
  title: string;
  message: string | null;
}

/**
 * API Request.
 */
export interface ApiRequest {
  /**
   * Ask to renew the session.
   */
  renew?: boolean;
}

/**
 * API Response.
 */
export interface ApiResponse<T = any> {
  /**
   * Possible error details.
   */
  errors: ApiError[];

  /**
   * Session expiration date-time.
   */
  expire?: DateJSON;

  /**
   * Result data.
   */
  result?: T;
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
 * Api Handler configurations
 */
export interface ApiHandlerGeneratorParams {
  storeGenerator: () => Store;
  databaseInterface: Database;
  schemaComplete: any;
  schemaPartial: any;
}

/**
 * Api Handler configurations
 */
export interface ApiHandlerParams<B = any>{
  body: B;
}

/**
 * API handler for a request.
 */
export type ApiHandler<B = any, R = Result> = (params: ApiHandlerParams<B>) => R;

/**
 * API object containing response handlers.
 */
export type ApiHandlers = Record<string, ApiHandler>;
