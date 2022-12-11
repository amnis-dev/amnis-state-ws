import type {
  AuthRegistration,
  AuthLogin,
  AuthLogout,
  // AuthPkce,
  AuthRenew,
  AuthVerify,
  AuthChallenge,
} from '@amnis/core';

export interface AuthSchema {
  challenge?: AuthChallenge;
  register?: AuthRegistration;
  login?: AuthLogin;
  logout?: AuthLogout;
  renew?: AuthRenew;
  verify?: AuthVerify;
}
