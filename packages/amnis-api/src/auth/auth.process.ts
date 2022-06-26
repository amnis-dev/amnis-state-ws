import Ajv from 'ajv';
import {
  passCompare,
} from '@amnis/auth/pass';
import authSchema from './auth.schema.json';
import {
  apiOutput,
  apiValidate,
} from '../api';
import type {
  ApiAuthProcesses,
  ApiAuthProcessesParams,
} from './auth.types';
import {
  userFind,
  loginSuccessProcess,
  outputBadCredentials,
} from './auth.utility';
import { authTwitter } from './auth.twitter';
import { authMicrosoft } from './auth.microsoft';

/**
 * Sets up authentication processes.
 */
export function apiAuthProcesses(params: ApiAuthProcessesParams): ApiAuthProcesses {
  const { database } = params;
  const ajv = new Ajv({ schemas: [authSchema] });
  const validators = {
    login: ajv.getSchema('auth#/definitions/ApiAuthLoginBody'),
    pkce: ajv.getSchema('auth#/definitions/ApiAuthPkceBody'),
    authorize: ajv.getSchema('auth#/definitions/ApiAuthAuthorizeBody'),
  };

  return {
    /**
     * ================================================================================
     * LOGIN
     * API Handler for a typical username and password login attempt.
     * ----------------------------------------
     */
    login: async ({ body }) => {
      const validateOutput = apiValidate(validators.login, body);
      if (validateOutput) {
        return validateOutput;
      }

      /**
       * CHECK CREDENTIALS
       */
      const { username, password } = body;

      const user = await userFind(database, username);

      if (!user) {
        return outputBadCredentials();
      }

      if (user.password === null || user.password.length < 8) {
        return outputBadCredentials();
      }

      const same = await passCompare(password, user.password);

      if (same === false) {
        return outputBadCredentials();
      }

      /**
       * SUCCESSFUL LOGIN
       */

      const successOutput = await loginSuccessProcess(database, user);

      return successOutput;
    },
    /**
     * ================================================================================
     * PKCE
     * Authenticates with OpenID OAuth2.0 PKCE flow after client obtains the authroization.
     * ----------------------------------------
     */
    pkce: async ({ body }) => {
      const validateOutput = apiValidate(validators.pkce, body);
      if (validateOutput) {
        return validateOutput;
      }

      const output = apiOutput();
      const { platform, ...pkceAuth } = body;

      switch (platform) {
        case 'microsoft': {
          const pkceOutput = await authMicrosoft(database, pkceAuth);
          return pkceOutput;
        }
        case 'twitter': {
          const pkceOutput = await authTwitter(database, pkceAuth);
          return pkceOutput;
        }
        default:
          output.status = 401; // Unauthorized
          output.json.errors.push({
            title: 'Unknown Platform',
            message: `Could not authenticate using the '${platform}' platform.`,
          });
          return output;
      }
    },
    /**
     * ================================================================================
     * AUTHORIZE
     * - TODO: Not implemented yet. -
     * ----------------------------------------
     */
    authorize: async (input) => {
      const output = apiOutput();
      const { body } = input;

      const validateOutput = apiValidate(validators.authorize, body);
      if (validateOutput) {
        return validateOutput;
      }

      return output;
    },
  };
}

export default apiAuthProcesses;
