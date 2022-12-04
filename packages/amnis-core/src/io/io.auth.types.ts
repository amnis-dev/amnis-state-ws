import type { Bearer } from '@amnis/core';

/**
 * Payload for an registration request.
 * A value of undefined starts a registration event.
 */
export interface AuthRegistration {
  /**
   * @minLength 2
   * @maxLength 24
   * @pattern ^[a-zA-Z0-9-_]+$
   * @description The usename to register under.
   */
  username: string;

  /**
   * @minLength 16
   * @maxLength 512
   * @desciption Encoded challenge object to prevent reply attacks.
   */
  challenge: string;

  /**
   * @minLength 4
   * @maxLength 32
   * @desciption Origin of the requesting client.
   */
  origin: string;

  /**
   * @desciption Type of event.
   */
  type: 'auth.create' | 'webauthn.create';

  /**
   * @minLength 16
   * @maxLength 512
   * @desciption Encoded credentials to register.
   */
  credential: string;

  /**
   * @minLength 16
   * @maxLength 512
   * @description Encoded attestation signature of the credential object.
   */
  signature: string;
}

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
   * @description Credential identifier to use on the user account.
   */
  $credential: string;

  /**
   * @minLength 128
   * @maxLength 512
   * @description Agent's cryptographic signature of the username and challenge.
   */
  signature: string;
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
