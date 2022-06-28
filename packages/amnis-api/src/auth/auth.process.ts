import Ajv from 'ajv';
import authSchema from './auth.schema.json';
import type {
  ApiAuthProcesses,
  ApiAuthProcessesParams,
} from './auth.types';
import { mwValidate } from '../mw.validate';
import { authProcessLogin } from './auth.process.login';
import { authProcessPcke } from './auth.process.pkce';
import { authProcessRenew } from './auth.process.renew';
import { mwSession } from '../mw.session';
import { authProcessVerify } from './auth.process.verify';

/**
 * Sets up authentication processes.
 */
export function apiAuthProcesses(params: ApiAuthProcessesParams): ApiAuthProcesses {
  const { store, database } = params;
  const ajv = new Ajv({ schemas: [authSchema] });

  return {
    login: mwValidate(authProcessLogin)({
      store,
      database,
      validator: ajv.getSchema('auth#/definitions/ApiAuthLoginBody'),
    }),

    pkce: mwValidate(authProcessPcke)({
      store,
      database,
      validator: ajv.getSchema('auth#/definitions/ApiAuthPkceBody'),
    }),

    renew: mwSession(mwValidate(authProcessRenew))({
      store,
      database,
      validator: ajv.getSchema('auth#/definitions/ApiAuthRenewBody'),
    }),

    verify: mwValidate(authProcessVerify)({
      store,
      database,
      validator: ajv.getSchema('auth#/definitions/ApiAuthVerifyBody'),
    }),
  };
}

export default apiAuthProcesses;
