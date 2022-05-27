/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiRequestBody, ApiResponseBody } from '@amnis/core/api';
import type { Select } from '@amnis/core/index';

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

/**
 * Select Request
 * Client -> Server
 */
export interface StateApiRequestBodySelect extends ApiRequestBody {
  /**
   * The query object.
   */
  select: Select;
}

/**
 * Select Response
 * Server -> Client
 */
export interface StateApiResponseBodySelect extends ApiResponseBody {
  result: any;
}
