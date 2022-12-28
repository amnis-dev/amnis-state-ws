import type {
  ApiAuthRegistration,
  ApiAuthLogin,
  ApiAuthLogout,
  // ApiAuthPkce,
  ApiAuthCreate,
  ApiAuthVerify,
  ApiAuthChallenge,
  ApiAuthAuthenticate,
  ApiAuthCredential,
  Challenge,
  Credential,
} from '@amnis/core';

export interface AuthSchema {
  authenticate?: ApiAuthAuthenticate;
  challenge?: ApiAuthChallenge;
  credential?: ApiAuthCredential;
  register?: ApiAuthRegistration;
  login?: ApiAuthLogin;
  logout?: ApiAuthLogout;
  verify?: ApiAuthVerify;
  create?: ApiAuthCreate;
  /**
   * Encoded types.
   */
  typeChallenge?: Challenge;
  typeCrendential?: Credential;
}
