/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiRequestBody, ApiResponseBody } from '@amnis/core/api';
import type { EntitySelectorQuery } from '@amnis/core/entity';

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
   * Key value of the slice to perform the query against.
   */
  slice: string;

  /**
   * The query object.
   */
  query: EntitySelectorQuery;
}

/**
 * Select Response
 * Server -> Client
 */
export interface StateApiResponseBodySelect extends ApiResponseBody {
  result: any;
}
