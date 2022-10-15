import type {
  ApiAuthProcesses,
} from './auth.types.js';
import { authProcessLogin } from './auth.process.login.js';
import { authProcessLogout } from './auth.process.logout.js';
import { authProcessPcke } from './auth.process.pkce.js';
import { authProcessRenew } from './auth.process.renew.js';
import { authProcessVerify } from './auth.process.verify.js';

export const apiAuthProcess: ApiAuthProcesses = {
  login: authProcessLogin,
  logout: authProcessLogout,
  pkce: authProcessPcke,
  renew: authProcessRenew,
  verify: authProcessVerify,
};

export default { apiAuthProcess };
