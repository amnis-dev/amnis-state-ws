import type { JWTEncoded, ResultCreate } from '@amnis/core/types';
import type {
  ApiProcess,
  ApiProcesses,
  ApiQuery,
} from '../types';

/**
 * Body of an authorization.
 */
export interface ApiAuthBody {
  method: 'msgraph' | 'twitter';
  token: JWTEncoded;
}

/**
 * API object containing request queries.
 */
export interface ApiAuthQueries {
  authorize: ApiQuery<ApiAuthBody>;
}

/**
 * API object containing response handlers.
 */
export interface ApiAuthProcesses extends ApiProcesses {
  authorize: ApiProcess<ApiAuthBody, ResultCreate>;
}
