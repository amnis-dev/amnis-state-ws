/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiRequestBody } from '@amnis/core/api';
import type { Select, Result } from '@amnis/core/index';

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
