import type {
  ApiAuthRegistration,
  ApiAuthLogin,
  ApiAuthLogout,
  // ApiAuthPkce,
  ApiAuthRenew,
  ApiAuthVerify,
  ApiAuthChallenge,
} from '@amnis/core';

export interface AuthSchema {
  challenge?: ApiAuthChallenge;
  register?: ApiAuthRegistration;
  login?: ApiAuthLogin;
  logout?: ApiAuthLogout;
  renew?: ApiAuthRenew;
  verify?: ApiAuthVerify;
}
