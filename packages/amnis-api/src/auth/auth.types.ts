import type { Store } from '@reduxjs/toolkit';

import type { StateCreate, StateDelete } from '@amnis/core/state';
import type { Database } from '@amnis/db/types';

import type { Token } from '@amnis/core/token';
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
 * Payload that destroys the user session and connection.
 */
export interface ApiAuthLogoutBody {
  [key: string]: never;
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

/**
 * ApiAuthPkceBody but without the platform specification
 * (used internally by the processes)
 */
export interface ApiAuthPkce {
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

/**
 * Payload for a session and token renewal.
 * Should not have any data in the body.
 */
export interface ApiAuthRenewBody {
  /**
   * Include user and profile data with the response.
   */
  info?: boolean;
}

/**
 * Verifies the validity of a stringified token.
 */
export type ApiAuthVerifyBody = Token;

/**
 * API object containing request queries.
 */
export interface ApiAuthQueries {
  login: ApiQuery<ApiAuthLoginBody>;
  logout: ApiQuery<ApiAuthLogoutBody>;
  pkce: ApiQuery<ApiAuthPkceBody>;
  renew: ApiQuery<ApiAuthRenewBody>;
  verify: ApiQuery<ApiAuthVerifyBody>;
}

export type ApiAuthProcessLogin = ApiProcess<ApiAuthLoginBody, StateCreate>;
export type ApiAuthProcessLogout = ApiProcess<ApiAuthLogoutBody, StateDelete>;
export type ApiAuthProcessPkce = ApiProcess<ApiAuthPkceBody, StateCreate>;
export type ApiAuthProcessRenew = ApiProcess<ApiAuthRenewBody, StateCreate>;
export type ApiAuthProcessVerify = ApiProcess<ApiAuthVerifyBody, boolean>;

/**
 * API object containing response handlers.
 */
export interface ApiAuthProcesses extends ApiProcesses {
  login: ApiAuthProcessLogin;
  logout: ApiAuthProcessLogout;
  pkce: ApiAuthProcessPkce;
  renew: ApiAuthProcessRenew;
  verify: ApiAuthProcessVerify;
}

/**
 * Api Handler configurations
 */
export interface ApiAuthProcessesParams {
  store: Store;
  database: Database;
}
