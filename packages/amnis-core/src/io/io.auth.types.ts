import type { Bearer } from '@amnis/core';

/**
 * Payload for a login request.
 */
export interface AuthLogin {
  /**
   * @minLength 2
   * @maxLength 24
   * @pattern ^[a-zA-Z0-9-_]+$
   * @description Unique name for login credentials
   */
  username: string;

  /**
   * @minLength 6
   * @maxLength 64
   * @description Secret phrase associated with the username.
   */
  password: string;
}

/**
 * Payload that destroys the user session and connection.
 */
export interface AuthLogout {
  [key: string]: never;
}

/**
 * Logs in from a third-party using the data from OpenID PKCE Authorization.
 */
export interface AuthPkce {
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
 * Payload for a session and bearer renewal.
 * Should not have any data in the body.
 */
export interface AuthRenew {
  /**
   * Include user and profile data with the response.
   */
  info?: boolean;
}

/**
 * Verifies the validity of a stringified bearer.
 */
export type AuthVerify = Bearer;
