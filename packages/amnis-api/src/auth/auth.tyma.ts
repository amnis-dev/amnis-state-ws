import type {
  ApiAuthLoginBody, ApiAuthPkceBody, ApiAuthRenewBody, ApiAuthVerifyBody,
} from './auth.types';

export interface ApiAuthBodies {
  login?: ApiAuthLoginBody;
  pkce?: ApiAuthPkceBody;
  renew?: ApiAuthRenewBody;
  verify?: ApiAuthVerifyBody;
}
