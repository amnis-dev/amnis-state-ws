import type {
  AuthRegistration,
  AuthLogin,
  AuthLogout,
  AuthPkce,
  AuthRenew,
  AuthVerify,
} from '@amnis/core';

export interface AuthSchema {
  register?: AuthRegistration;
  login?: AuthLogin;
  logout?: AuthLogout;
  pkce?: AuthPkce;
  renew?: AuthRenew;
  verify?: AuthVerify;
}
