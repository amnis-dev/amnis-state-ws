import type { ApiAuthLoginBody, ApiAuthAuthorizeBody } from './auth.types';

export interface ApiAuthBodies {
  login?: ApiAuthLoginBody;
  authorize?: ApiAuthAuthorizeBody;
}
