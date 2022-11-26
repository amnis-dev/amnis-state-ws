import type {
  AuthLogin,
  AuthLogout,
  AuthPkce,
  AuthRenew,
  AuthVerify,
} from '@amnis/core';

export interface AuthSchema {
  login?: AuthLogin;
  logout?: AuthLogout;
  pkce?: AuthPkce;
  renew?: AuthRenew;
  verify?: AuthVerify;
}
