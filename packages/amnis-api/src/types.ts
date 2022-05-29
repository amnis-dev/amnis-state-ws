/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, Store } from '@reduxjs/toolkit';
import type { FetchArgs } from '@reduxjs/toolkit/dist/query';
import type {
  Select, Result, DateJSON, Database,
} from '@amnis/core/index';

/**
 * An API error repsonse.
 */
export interface ApiError {
  code: number;
  message: string | null;
}

/**
 * API Request.
 */
export interface ApiRequestBody {
  /**
   * Ask to renew the session.
   */
  renew?: boolean;
}

/**
 * API Response.
 */
export interface ApiResponseBody {
  /**
   * Possible error details.
   */
  error?: ApiError;

  /**
   * Session expiration date-time.
   */
  expire?: DateJSON;
}

/**
 * API Redux Payload
 */
export interface ApiPayload<B extends ApiRequestBody = ApiRequestBody> {
  body: B;
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
export interface ApiHandlerParams{
  body: any;
  store: Store;
  database: Database;
}

/**
 * API handler for a request.
 */
export type ApiHandler<
  ResB = any,
> = (params: ApiHandlerParams) => ResB;

/**
 * API object containing response handlers.
 */
export type ApiHandlers = Record<string, ApiHandler>;
