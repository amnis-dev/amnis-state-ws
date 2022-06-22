import type { Store } from '@reduxjs/toolkit';
import type { Database, JWTEncoded, ResultCreate } from '@amnis/core/types';
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
 * Logs in from a third-party using the data from OpenID PKCE Authorization.
 */
export interface ApiAuthPkceBody {
  platform: 'microsoft' | 'twitter',
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

export interface ApiAuthPkce {
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
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
  pkce: ApiQuery<ApiAuthPkceBody>;
  authorize: ApiQuery<ApiAuthAuthorizeBody>;
}

/**
 * API object containing response handlers.
 */
export interface ApiAuthProcesses extends ApiProcesses {
  login: ApiProcess<ApiAuthLoginBody, ResultCreate>;
  pkce: ApiProcess<ApiAuthPkceBody>;
  authorize: ApiProcess<ApiAuthAuthorizeBody, ResultCreate>;
}

/**
 * Api Handler configurations
 */
export interface ApiAuthProcessesParams {
  store: Store;
  database: Database;
}
