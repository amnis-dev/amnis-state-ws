import { authProcessLogin } from './auth.login.js';
import { authProcessLogout } from './auth.logout.js';
import { authProcessPcke } from './auth.pkce.js';
import { authProcessRegister } from './auth.register.js';
import { authProcessRenew } from './auth.renew.js';
import { authProcessVerify } from './auth.verify.js';

export const authProcess = {
  register: authProcessRegister,
  login: authProcessLogin,
  logout: authProcessLogout,
  pkce: authProcessPcke,
  renew: authProcessRenew,
  verify: authProcessVerify,
};

export default authProcess;
