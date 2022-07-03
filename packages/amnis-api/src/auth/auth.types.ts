import type { Store } from '@reduxjs/toolkit';

import type { StateCreate } from '@amnis/core/state';
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
export type ApiAuthRenewBody = Record<string, never>;

/**
 * Verifies the validity of a stringified token.
 */
export type ApiAuthVerifyBody = Token;

/**
 * API object containing request queries.
 */
export interface ApiAuthQueries {
  login: ApiQuery<ApiAuthLoginBody>;
  pkce: ApiQuery<ApiAuthPkceBody>;
  renew: ApiQuery<ApiAuthRenewBody>;
  verify: ApiQuery<ApiAuthVerifyBody>;
}

export type ApiAuthProcessLogin = ApiProcess<ApiAuthLoginBody, StateCreate>;
export type ApiAuthProcessPkce = ApiProcess<ApiAuthPkceBody, StateCreate>;
export type ApiAuthProcessRenew = ApiProcess<ApiAuthRenewBody, StateCreate>;
export type ApiAuthProcessVerify = ApiProcess<ApiAuthVerifyBody, boolean>;

/**
 * API object containing response handlers.
 */
export interface ApiAuthProcesses extends ApiProcesses {
  login: ApiAuthProcessLogin;
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
