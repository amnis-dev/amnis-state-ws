import type {
  ApiHandler,
  ApiHandlers,
  ApiQuery,
} from '../types';

/**
 * API object containing request queries.
 */
export interface ApiAuthQueries {
  authorize: ApiQuery;
}

/**
 * API object containing response handlers.
 */
export interface ApiAuthHandlers extends ApiHandlers {
  authorize: ApiHandler;
}
