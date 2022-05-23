import type { ApiRequestBody, ApiResponseBody } from '@amnis/core/api';

/**
 * Dispatch Request
 * Client -> Server
 */
export interface StateApiRequestBodyDispatch extends ApiRequestBody {
  type: string;
  payload: unknown;
}

/**
 * Dispatch Response
 * Returns the action when fulfilled.
 * Server -> Client
 */
export interface StateApiResponseBodyDispatch extends ApiResponseBody {
  type: string;
  payload: unknown;
}
