import Ajv from 'ajv';
import authSchema from './auth.schema.json';
import type {
  ApiAuthProcesses,
  ApiAuthProcessesParams,
} from './auth.types';
import { mwValidate } from '../mw.validate';
import { authProcessLogin } from './auth.process.login';
import { authProcessPcke } from './auth.process.pkce';

/**
 * Sets up authentication processes.
 */
export function apiAuthProcesses(params: ApiAuthProcessesParams): ApiAuthProcesses {
  const { store, database } = params;
  const ajv = new Ajv({ schemas: [authSchema] });

  return {
    /**
     * ================================================================================
     * LOGIN
     * API Handler for a typical username and password login attempt.
     * ----------------------------------------
     */
    login: mwValidate(authProcessLogin)({
      store,
      database,
      validator: ajv.getSchema('auth#/definitions/ApiAuthLoginBody'),
    }),
    /**
     * ================================================================================
     * PKCE
     * Authenticates with OpenID OAuth2.0 PKCE flow after client obtains the authroization.
     * ----------------------------------------
     */
    pkce: mwValidate(authProcessPcke)({
      store,
      database,
      validator: ajv.getSchema('auth#/definitions/ApiAuthPkceBody'),
    }),
  };
}

export default apiAuthProcesses;
