import type { JWTEncoded, ResultCreate } from '@amnis/core/types';
import type {
  ApiHandler,
  ApiHandlers,
  ApiQuery,
  ApiResponse,
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
export interface ApiAuthHandlers extends ApiHandlers {
  authorize: ApiHandler<ApiAuthBody, ApiResponse<ResultCreate>>;
}
