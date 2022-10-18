import { authProcessLogin } from './auth.login.js';
import { authProcessLogout } from './auth.logout.js';
import { authProcessPcke } from './auth.process.pkce.js';
import { authProcessRenew } from './auth.process.renew.js';
import { authProcessVerify } from './auth.process.verify.js';

export const apiAuthProcess = {
  login: authProcessLogin,
  logout: authProcessLogout,
  pkce: authProcessPcke,
  renew: authProcessRenew,
  verify: authProcessVerify,
};

export default apiAuthProcess;
