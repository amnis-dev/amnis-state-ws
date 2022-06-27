import type { Store } from '@reduxjs/toolkit';

import { ResultCreate, ResultUpdate } from '@amnis/core/state';
import type { Database } from '@amnis/db/index';

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
 * API object containing request queries.
 */
export interface ApiAuthQueries {
  login: ApiQuery<ApiAuthLoginBody>;
  pkce: ApiQuery<ApiAuthPkceBody>;
  renew: ApiQuery<ApiAuthRenewBody>;
}

export type ApiAuthProcessLogin = ApiProcess<ApiAuthLoginBody, ResultCreate>;
export type ApiAuthProcessPkce = ApiProcess<ApiAuthPkceBody, ResultCreate>;
export type ApiAuthProcessRenew = ApiProcess<ApiAuthPkceBody, ResultUpdate>;

/**
 * API object containing response handlers.
 */
export interface ApiAuthProcesses extends ApiProcesses {
  login: ApiAuthProcessLogin;
  pkce: ApiAuthProcessPkce;
  renew: ApiAuthProcessRenew;
}

/**
 * Api Handler configurations
 */
export interface ApiAuthProcessesParams {
  store: Store;
  database: Database;
}
