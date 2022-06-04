import { Result } from '@amnis/core/types';
import type {
  ApiHandler,
  ApiHandlers,
  ApiQuery,
  ApiResponse,
} from '../types';
import { ApiMSGraphMyEndpoint } from './msgraph.endpoint.types';

/**
 * API object containing request queries.
 */
export interface ApiMSGraphQueries {
  myendpoint: ApiQuery;
}

/**
 * API object containing response handlers.
 */
export interface ApiMSGraphHandlers extends ApiHandlers {
  myendpoint: ApiHandler<ApiMSGraphMyEndpoint, ApiResponse<Result>>;
}
