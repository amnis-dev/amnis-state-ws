import type {
  ApiAuthBodyLogin,
  ApiAuthBodyLogout,
  ApiAuthBodyPkce,
  ApiAuthBodyRenew,
  ApiAuthBodyVerify,
} from './auth.types.js';

export interface ApiAuthBodies {
  login?: ApiAuthBodyLogin;
  logout?: ApiAuthBodyLogout;
  pkce?: ApiAuthBodyPkce;
  renew?: ApiAuthBodyRenew;
  verify?: ApiAuthBodyVerify;
}
