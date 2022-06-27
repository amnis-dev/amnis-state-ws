import type { ApiAuthLoginBody, ApiAuthPkceBody, ApiAuthRenewBody } from './auth.types';

export interface ApiAuthBodies {
  login?: ApiAuthLoginBody;
  pkce?: ApiAuthPkceBody;
  renew?: ApiAuthRenewBody;
}
