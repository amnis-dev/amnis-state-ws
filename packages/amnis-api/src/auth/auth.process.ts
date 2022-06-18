import Ajv from 'ajv';
import type {
  CoreUser,
} from '@amnis/core/types';
import {
  passCompare,
} from '@amnis/auth/index';
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
  loginSuccessProcess,
  outputBadCredentials,
} from './auth.protility';

/**
 * Sets up authentication processes.
 */
export function apiAuthProcesses(params: ApiAuthProcessesParams): ApiAuthProcesses {
  const { database } = params;
  const ajv = new Ajv({ schemas: [authSchema] });
  const validators = {
    login: ajv.getSchema('auth#/definitions/ApiAuthLoginBody'),
    authorize: ajv.getSchema('auth#/definitions/ApiAuthAuthorizeBody'),
  };

  return {
    /**
     * API Handler for a typical username and password login attempt.
     */
    login: async (input) => {
      const { body } = input;

      const validateOutput = apiValidate(validators.login, body);
      if (validateOutput) {
        return validateOutput;
      }

      /**
       * CHECK CREDENTIALS
       */
      const { username, password } = body;

      const resultsUser = await database.read({
        user: {
          $query: {
            name: {
              $eq: username,
            },
          },
        },
      }, { user: 'global' });

      if (!resultsUser.user?.length) {
        return outputBadCredentials();
      }

      const user = { ...resultsUser.user[0] } as CoreUser;

      if (user.password === null) {
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
     * API handler for creating new data in storage.
     */
    authorize: async (input) => {
      const output = apiOutput();
      const { body } = input;

      const validateOutput = apiValidate(validators.authorize, body);
      if (validateOutput) {
        return validateOutput;
      }

      // switch (method) {
      //   case 'msgraph':
      //     // do nothing.
      //     break;

      //   default:
      // }

      return output;
    },
  };
}

export default apiAuthProcesses;
