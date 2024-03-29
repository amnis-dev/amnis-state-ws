import { processAuthChallenge } from './auth.challenge.js';
import { processAuthCreate } from './auth.create.js';
import { processAuthCredential } from './auth.credential.js';
import { processAuthLogin } from './auth.login.js';
import { processAuthLogout } from './auth.logout.js';
import { processAuthOtp } from './auth.otp.js';
// import { processAuthPcke } from './auth.pkce.js';
import { processAuthRegister } from './auth.register.js';
import { processAuthVerify } from './auth.verify.js';

export const processAuth = {
  challenge: processAuthChallenge,
  create: processAuthCreate,
  credential: processAuthCredential,
  otp: processAuthOtp,
  register: processAuthRegister,
  login: processAuthLogin,
  logout: processAuthLogout,
  /**
   * TODO: PKCE logins need to be refactored with newly implemented login and registation methods.
   */
  // pkce: processAuthPcke,
  verify: processAuthVerify,
};

export default processAuth;
