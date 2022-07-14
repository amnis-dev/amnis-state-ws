import type { StateCreate, StateDelete } from '@amnis/core/state';
import type { Token } from '@amnis/core/token';
import type {
  ApiIO,
  ApiProcess,
  ApiProcesses,
  ApiQuery,
} from '../types';

/**
 * Payload for a login request.
 */
export interface ApiAuthBodyLogin {
  /**
   * @minLength 2
   * @maxLength 24
   * @pattern ^[a-zA-Z0-9-_]+$
   */
  username: string,

  /**
   * @minLength 6
   * @maxLength 64
   */
  password: string,
}

/**
 * Payload that destroys the user session and connection.
 */
export interface ApiAuthBodyLogout {
  [key: string]: never;
}

/**
 * Logs in from a third-party using the data from OpenID PKCE Authorization.
 */
export interface ApiAuthBodyPkce {
  /**
   * Supported PKCE login methods.
   */
  platform: 'microsoft' | 'twitter',

  /**
   * @minLength 16
   * @maxLength 128
   * @pattern ^[a-zA-Z0-9-_]+$
   */
  clientId: string;

  /**
   * @minLength 32
   * @maxLength 1024
   * @pattern ^[a-zA-Z0-9-_.]+$
   */
  code: string;

  /**
   * @minLength 32
   * @maxLength 256
   * @pattern ^[a-zA-Z0-9-_]+$
   */
  codeVerifier: string;

  /**
   * @minLength 8
   * @maxLength 512
   * @pattern https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?
   */
  redirectUri: string;

  /**
   * @minLength 16
   * @maxLength 64
   * @pattern ^[a-zA-Z0-9-_]+$
   */
  tenantId?: string;

  /**
   * True or false value.
   */
  gov?: boolean;
}

/**
 * Payload for a session and token renewal.
 * Should not have any data in the body.
 */
export interface ApiAuthBodyRenew {
  /**
   * Include user and profile data with the response.
   */
  info?: boolean;
}

/**
 * Verifies the validity of a stringified token.
 */
export type ApiAuthBodyVerify = Token;

/**
 * API object containing request queries.
 */
export interface ApiAuthQueries {
  login: ApiQuery<ApiAuthBodyLogin>;
  logout: ApiQuery<ApiAuthBodyLogout>;
  pkce: ApiQuery<ApiAuthBodyPkce>;
  renew: ApiQuery<ApiAuthBodyRenew>;
  verify: ApiQuery<ApiAuthBodyVerify>;
}

export type ApiAuthIOLogin = ApiIO<ApiAuthBodyLogin, StateCreate>;
export type ApiAuthIOLogout = ApiIO<ApiAuthBodyLogout, StateDelete>;
export type ApiAuthIOPkce = ApiIO<ApiAuthBodyPkce, StateCreate>;
export type ApiAuthIORenew = ApiIO<ApiAuthBodyRenew, StateCreate>;
export type ApiAuthIOVerify = ApiIO<ApiAuthBodyVerify, boolean>;

/**
 * API object containing response handlers.
 */
export interface ApiAuthProcesses extends ApiProcesses {
  login: ApiProcess<ApiAuthIOLogin>;
  logout: ApiProcess<ApiAuthIOLogout>;
  pkce: ApiProcess<ApiAuthIOPkce>;
  renew: ApiProcess<ApiAuthIORenew>;
  verify: ApiProcess<ApiAuthIOVerify>;
}
