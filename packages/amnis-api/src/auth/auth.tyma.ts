import type {
  ApiAuthLoginBody,
  ApiAuthLogoutBody,
  ApiAuthPkceBody,
  ApiAuthRenewBody,
  ApiAuthVerifyBody,
} from './auth.types';

export interface ApiAuthBodies {
  login?: ApiAuthLoginBody;
  logout?: ApiAuthLogoutBody;
  pkce?: ApiAuthPkceBody;
  renew?: ApiAuthRenewBody;
  verify?: ApiAuthVerifyBody;
}
