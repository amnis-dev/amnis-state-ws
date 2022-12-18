import type {
  ApiAuthRegistration,
  ApiAuthLogin,
  ApiAuthLogout,
  // ApiAuthPkce,
  ApiAuthRenew,
  ApiAuthVerify,
  ApiAuthChallenge,
  ApiAuthAuthenticate,
} from '@amnis/core';

export interface AuthSchema {
  authenticate?: ApiAuthAuthenticate;
  challenge?: ApiAuthChallenge;
  register?: ApiAuthRegistration;
  login?: ApiAuthLogin;
  logout?: ApiAuthLogout;
  renew?: ApiAuthRenew;
  verify?: ApiAuthVerify;
}
