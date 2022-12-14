import { processAuthChallenge } from './auth.challenge.js';
import { processAuthLogin } from './auth.login.js';
import { processAuthLogout } from './auth.logout.js';
// import { processAuthPcke } from './auth.pkce.js';
import { processAuthRegister } from './auth.register.js';
import { processAuthVerify } from './auth.verify.js';

export const processAuth = {
  challenge: processAuthChallenge,
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
