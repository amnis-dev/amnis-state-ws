import type {
  ApiAuthRegistration,
  ApiAuthLogin,
  ApiAuthLogout,
  // ApiAuthPkce,
  ApiAuthRenew,
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
  renew?: ApiAuthRenew;
  verify?: ApiAuthVerify;
  /**
   * Encoded types.
   */
  typeChallenge?: Challenge;
  typeCrendential?: Credential;
}
