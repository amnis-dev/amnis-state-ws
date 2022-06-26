import { Result } from '@amnis/core/state';
import type {
  ApiProcess,
  ApiProcesses,
  ApiQuery,
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
export interface ApiMSGraphProcesses extends ApiProcesses {
  myendpoint: ApiProcess<ApiMSGraphMyEndpoint, Result>;
}
