import type {
  AuthLogin,
  AuthLogout,
  AuthPkce,
  AuthRenew,
  AuthVerify,
} from '@amnis/core/index.js';

export interface AuthSchema {
  login?: AuthLogin;
  logout?: AuthLogout;
  pkce?: AuthPkce;
  renew?: AuthRenew;
  verify?: AuthVerify;
}
