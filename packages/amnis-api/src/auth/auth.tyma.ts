import type { ApiAuthLoginBody, ApiAuthPkceBody, ApiAuthAuthorizeBody } from './auth.types';

export interface ApiAuthBodies {
  login?: ApiAuthLoginBody;
  pkce?: ApiAuthPkceBody;
  authorize?: ApiAuthAuthorizeBody;
}
