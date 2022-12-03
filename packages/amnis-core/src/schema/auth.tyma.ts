import type {
  AuthRegister,
  AuthLogin,
  AuthLogout,
  AuthPkce,
  AuthRenew,
  AuthVerify,
} from '@amnis/core';

export interface AuthSchema {
  register?: AuthRegister;
  login?: AuthLogin;
  logout?: AuthLogout;
  pkce?: AuthPkce;
  renew?: AuthRenew;
  verify?: AuthVerify;
}
