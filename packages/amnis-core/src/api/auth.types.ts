import type { Bearer } from '../state/bearer/index.js';

/**
 * Challenge purposes
 */
export type ApiAuthChallengePurpose = 'resetpass' | 'adddevice' | 'register' | 'confirm';

/**
 * Challenge Generation Request.
 */
export interface ApiAuthChallenge {
  /**
   * @minLength 8
   * @maxLength 32
   * @description Subject that the challenge only works for. A subject challenge includes an OTP.
   */
  subject?: string;

  /**
   * An optional purpose title for the challenge.
   */
  purpose?: ApiAuthChallengePurpose;

  /**
   * Email address to send the one-time-passcode to.
   * @pattern ^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$
   * @maxLength 64
   * @errorMessage "The email address is poorly formatted"
   */
  email?: string;

  /**
   * Options signature from a privileged account to return the OTP.
   */
  signature?: string;
}

/**
 * Adds a credential to an account.
 */
export interface ApiAuthCredential {
  /**
   * @minLength 16
   * @maxLength 512
   * @desciption Encoded signature challenge object to prevent reply attacks
   * with a level of authenticity using an OTP.
   */
  challenge: string;

  /**
   * @minLength 16
   * @maxLength 512
   * @desciption Encoded credentials to add.
   */
  credential: string;

  /**
   * @minLength 16
   * @maxLength 512
   * @description Encoded attestation signature of the encoded credential.
   */
  signature: string;
}

/**
 * A request to authenticate with a session.
 * User must log in if authentication fails.
 */
export interface ApiAuthAuthenticate {
  /**
   * @minLength 16
   * @maxLength 512
   * @desciption Encoded challenge object to prevent reply attacks.
   */
  challenge: string;

  /**
   * @minLength 16
   * @maxLength 512
   * @description Encoded attestation signature of the challenge object.
   */
  signature: string;
}

/**
 * Payload for an registration request.
 * A value of undefined starts a registration event.
 */
export interface ApiAuthRegistration {
  /**
   * @minLength 2
   * @maxLength 24
   * @pattern ^[a-zA-Z0-9-_]+$
   * @description The usename to register under.
   */
  username: string;

  /**
   * @minLength 4
   * @maxLength 32
   * @description The password for the registration.
   */
  password: string;

  /**
   * @pattern ^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$
   * @maxLength 64
   * @description Email address to add to the account to receive one-time-passcodes.
   * @errorMessage "The email address is poorly formatted"
   */
  email?: string;

  /**
   * @minLength 2
   * @maxLength 24
   * @description The display name to register under.
   */
  displayName: string;

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
   * @description Encoded attestation signature of the challenge + credential encodings.
   */
  signature: string;
}

/**
 * Payload for a login request.
 */
export interface ApiAuthLogin {
  /**
   * @minLength 2
   * @maxLength 24
   * @pattern ^[a-zA-Z0-9-_]+$
   * @description Unique name for login credentials
   */
  username: string;

  /**
   * @minLength 4
   * @maxLength 32
   * @description The password for the login.
   */
  password?: string;

  /**
   * @minLength 16
   * @maxLength 512
   * @desciption Encoded challenge object to prevent reply attacks.
   */
  challenge: string;

  /**
   * @minLength 12
   * @maxLength 40
   * @description Credential identifier to use on the user account.
   */
  $credential: string;

  /**
   * @minLength 8
   * @maxLength 512
   * @description Agent's cryptographic signature of the username and challenge.
   */
  signature: string;
}

/**
 * Payload that destroys the user session and connection.
 */
export interface ApiAuthLogout {
  [key: string]: never;
}

/**
 * Logs in from a third-party using the data from OpenID PKCE Authorization.
 */
export interface ApiAuthPkce {
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
export interface ApiAuthRenew {
  /**
   * Include user and profile data with the response.
   */
  info?: boolean;
}

/**
 * Verifies the validity of a stringified bearer.
 */
export type ApiAuthVerify = Bearer;
