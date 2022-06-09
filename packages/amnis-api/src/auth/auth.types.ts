import type { JWTEncoded, ResultCreate } from '@amnis/core/types';
import type {
  ApiProcess,
  ApiProcesses,
  ApiQuery,
} from '../types';

/**
 * Payload for a login request.
 */
export interface ApiAuthLoginBody {
  username: string,
  password: string,
}

/**
 * Payload for an alternative method of authorization.
 */
export interface ApiAuthAuthorizeBody {
  method: 'msgraph' | 'twitter';
  jwt: JWTEncoded;
}

/**
 * API object containing request queries.
 */
export interface ApiAuthQueries {
  login: ApiQuery<ApiAuthLoginBody>;
  authorize: ApiQuery<ApiAuthAuthorizeBody>;
}

/**
 * API object containing response handlers.
 */
export interface ApiAuthProcesses extends ApiProcesses {
  login: ApiProcess<ApiAuthLoginBody, ResultCreate>;
  authorize: ApiProcess<ApiAuthAuthorizeBody, ResultCreate>;
}
