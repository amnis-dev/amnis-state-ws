import type MSGraph from '@microsoft/microsoft-graph-types';
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
 * Payload for a login request.
 */
export interface ApiAuthPlatformBody {
  platform: 'microsoft' | 'twitter',
  token: string,
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
  platform: ApiQuery<ApiAuthPlatformBody>;
  authorize: ApiQuery<ApiAuthAuthorizeBody>;
}

/**
 * API object containing response handlers.
 */
export interface ApiAuthProcesses extends ApiProcesses {
  login: ApiProcess<ApiAuthLoginBody, ResultCreate>;
  platform: ApiProcess<ApiAuthPlatformBody, ResultCreate>;
  authorize: ApiProcess<ApiAuthAuthorizeBody, ResultCreate>;
}

/**
 * Api Handler configurations
 */
export interface ApiAuthProcessesParams {
  store: Store;
  database: Database;
}

/**
 * Microsoft Graph User
 */
export type ApiAuthMicrosoftUser = MSGraph.User;

/**
 * Minimal Twitter user interface.
 */
export interface ApiAuthTwitterUser {
  id: string;
  name: string;
  username: string;
}
