/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Store } from '@reduxjs/toolkit';
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
 * API handler for a request.
 */
export type ApiHandler<
  ReqB = any,
  ResB = any,
> = (body: ReqB, store: Store, db: Database) => ResB;

/**
 * API object containing response handlers.
 */
export interface ApiHandlers {
  [key: string]: ApiHandler;
}

/**
 * Dispatch Request
 * Client -> Server
 */
export interface ApiRequestBodyDispatch extends ApiRequestBody {
  type: string;
  payload: unknown;
}

/**
 * Dispatch Response
 * Returns the action when fulfilled.
 * Server -> Client
 */
export type ApiResponseBodyDispatch = Result;

/**
 * Select Request
 * Client -> Server
 */
export interface ApiRequestBodySelect extends ApiRequestBody {
  /**
   * The query object.
   */
  select: Select;
}

/**
 * Select Response
 * Server -> Client
 */
export type ApiResponseBodySelect = Result;
