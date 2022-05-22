import type { FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { DateJSON } from '../core.types';

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
  P extends ApiPayload = ApiPayload
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
  ReqB extends ApiRequestBody = ApiRequestBody,
  ResB extends ApiResponseBody = ApiResponseBody
> = (body: ReqB) => ResB;

/**
 * API object containing response handlers.
 */
export interface ApiHandlers {
  [key: string]: ApiHandler;
}
