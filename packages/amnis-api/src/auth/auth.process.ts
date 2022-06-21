import Ajv from 'ajv';
import fetch from 'cross-fetch';
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
  ApiAuthMicrosoftUser,
} from './auth.types';
import {
  userFind,
  loginSuccessProcess,
  outputBadCredentials,
} from './auth.protility';
import { authTwitter } from './auth.twitter';

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
          const user = await data.json();
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
     * PKCE
     * Authenticates with OpenID OAuth2.0 PKCE flow after client obtains the authroization.
     * ----------------------------------------
     */
    pkce: async ({ body }) => {
      const output = apiOutput();
      const { platform, ...pkceAuth } = body;

      switch (platform) {
        case 'twitter': {
          const twitterOutput = await authTwitter(database, pkceAuth);
          return twitterOutput;
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
