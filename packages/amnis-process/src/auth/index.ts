import { authProcessChallenge } from './auth.challenge.js';
import { authProcessLogin } from './auth.login.js';
import { authProcessLogout } from './auth.logout.js';
// import { authProcessPcke } from './auth.pkce.js';
import { authProcessRegister } from './auth.register.js';
import { authProcessVerify } from './auth.verify.js';

export const authProcess = {
  challenge: authProcessChallenge,
  register: authProcessRegister,
  login: authProcessLogin,
  logout: authProcessLogout,
  /**
   * TODO: PKCE logins need to be refactored with newly implemented login and registation methods.
   */
  // pkce: authProcessPcke,
  verify: authProcessVerify,
};

export default authProcess;
