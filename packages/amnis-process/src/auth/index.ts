import { authProcessLogin } from './auth.login.js';
import { authProcessLogout } from './auth.logout.js';
import { authProcessPcke } from './auth.pkce.js';
import { authProcessRenew } from './auth.renew.js';
import { authProcessVerify } from './auth.verify.js';

export const authProcess = {
  login: authProcessLogin,
  logout: authProcessLogout,
  pkce: authProcessPcke,
  renew: authProcessRenew,
  verify: authProcessVerify,
};

export default authProcess;
