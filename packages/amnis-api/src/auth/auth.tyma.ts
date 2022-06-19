import type { ApiAuthLoginBody, ApiAuthPlatformBody, ApiAuthAuthorizeBody } from './auth.types';

export interface ApiAuthBodies {
  login?: ApiAuthLoginBody;
  platform?: ApiAuthPlatformBody;
  authorize?: ApiAuthAuthorizeBody;
}
