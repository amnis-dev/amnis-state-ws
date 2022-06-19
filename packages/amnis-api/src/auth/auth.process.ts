import Ajv from 'ajv';
import fetch from 'cross-fetch';
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
  ApiAuthMicrosoftUser,
  ApiAuthTwitterUser,
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
    platform: ajv.getSchema('auth#/definitions/ApiAuthPlatformBody'),
    authorize: ajv.getSchema('auth#/definitions/ApiAuthAuthorizeBody'),
  };

  const platformUrls = {
    microsoft: 'https://graph.microsoft.com/v1.0/me/',
    twitter: 'https://api.twitter.com/2/users/me',
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
     * ================================================================================
     * PLATFORM
     * Authenticates signs in the user with a token from a thrid-party platform.
     * ----------------------------------------
     */
    platform: async ({ body }) => {
      const validateOutput = apiValidate(validators.platform, body);
      if (validateOutput) {
        return validateOutput;
      }

      const output = apiOutput();
      const { platform, token } = body;

      console.log('PLATFORM BODY', body);

      switch (platform) {
        case 'microsoft': {
          const data = await fetch(platformUrls[platform], {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const user = await data.json() as ApiAuthMicrosoftUser;
          console.log('MICROSOFT RESULT:', user);
          return output;
        }
        case 'twitter': {
          const data = await fetch(platformUrls[platform], {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const user = await data.json() as ApiAuthTwitterUser;
          console.log('TWITTER RESULT:', user);
          return output;
        }
        default:
          output.json.errors.push({
            title: 'Unknown Platform',
            message: `Unable to authenticate with '${platform}' platform.`,
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
