import type {
  HandleName,
  Credential,
} from '../entity/index.js';
import type {
  Bearer,
} from '../state/index.js';
import type {
  SignatureEncoded,
  UID,
  Email,
  Password,
} from '../types.js';

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
   */
  email?: Email;

  /**
   * Options signature from a privileged account to return the OTP.
   */
  signature?: SignatureEncoded;
}

/**
 * Adds a credential to an account.
 */
export interface ApiAuthCredential {
  /**
   * Credential entity to assign.
   */
  credential: Credential;
}

/**
 * A request to authenticate with a session.
 * User must log in if authentication fails.
 */
export type ApiAuthAuthenticate = Record<string, never>;

/**
 * Payload for an registration request.
 * A value of undefined starts a registration event.
 */
export interface ApiAuthRegistration {
  /**
   * The handle name to register under.
   */
  handle: HandleName;

  /**
   * The password for the registration.
   */
  password: Password;

  /**
   * Email address to add to the account to receive one-time-passcodes.
   */
  email?: Email;

  /**
   * The display name to register under.
   *
   * @minLength 2
   * @maxLength 24
   */
  displayName: string;

  /**
   * Origin of the requesting client.
   *
   * @minLength 4
   * @maxLength 32
   */
  origin: string;

  /**
   * Type of event.
   */
  type: 'auth.create' | 'webauthn.create';

  /**
   * Credential to add during the registration.
   */
  credential: Credential;
}

/**
 * Payload for a login request.
 */
export interface ApiAuthLogin {
  /**
   * Unique name for login credentials
   */
  handle: HandleName;

  /**
   * The login password
   */
  password?: Password;

  /**
   * Credential identifier to use on the user account.
   */
  $credential: UID;
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
 * Creates an account for authentication.
 */
export interface ApiAuthCreate {
  /**
   * The user handle.
   */
  handle: HandleName;

  /**
   * The account password to apply.
   */
  password: Password;

  /**
   * Account email address for important account related information
   */
  email?: Email;

  /**
   * Display name for the account profile.
   */
  nameDisplay?: string;
}

/**
 * Verifies the validity of a stringified bearer.
 */
export type ApiAuthVerify = Bearer;
