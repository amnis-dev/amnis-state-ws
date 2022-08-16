import type {
  ApiAuthProcesses,
} from './auth.types';
import { authProcessLogin } from './auth.process.login';
import { authProcessLogout } from './auth.process.logout';
import { authProcessPcke } from './auth.process.pkce';
import { authProcessRenew } from './auth.process.renew';
import { authProcessVerify } from './auth.process.verify';

export const apiAuthProcess: ApiAuthProcesses = {
  login: authProcessLogin,
  logout: authProcessLogout,
  pkce: authProcessPcke,
  renew: authProcessRenew,
  verify: authProcessVerify,
};

export default { apiAuthProcess };
