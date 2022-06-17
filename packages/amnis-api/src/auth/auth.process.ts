import Ajv from 'ajv';
import type {
  JWTDecoded,
  ResultCreate,
  CoreSession,
  Token,
  CoreUser,
} from '@amnis/core/types';
import {
  AUTH_SESSION_LIFE,
  AUTH_TOKEN_LIFE,
  jwtEncode,
  passCompareSync,
  sessionEncode,
} from '@amnis/auth/index';
import {
  dateNumeric,
  entityCreate,
  tokenStringify,
} from '@amnis/core/core';
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
  outputBadCredentials,
  profileFetch,
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
    login: (input) => {
      const output = apiOutput<ResultCreate>();
      const { body } = input;

      const validateOutput = apiValidate(validators.login, body);
      if (validateOutput) {
        return validateOutput;
      }

      /**
       * CHECK CREDENTIALS
       */
      const { username, password } = body;

      const resultsUser = database.read({
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

      const same = passCompareSync(password, user.password);

      if (same === false) {
        return outputBadCredentials();
      }

      const tokenExpires = dateNumeric(AUTH_TOKEN_LIFE);
      const sessionExpires = dateNumeric(AUTH_SESSION_LIFE);

      /**
       * SUCCESSFUL LOGIN
       */

      const profile = profileFetch(database, user);

      /**
       * Create the JWT data.
       */
      const jwtDecoded: JWTDecoded = {
        iss: '',
        sub: user.$id,
        exp: tokenExpires,
        typ: 'access',
        roles: user.$roles,
      };

      /**
       * Create the token container.
       * This is so we have ensured data about our JWT.
       */
      const tokenAccess: Token = {
        api: 'core',
        exp: tokenExpires,
        jwt: jwtEncode(jwtDecoded),
        type: 'access',
      };

      /**
       * Create the new user session.
       */
      const session = entityCreate<CoreSession>('session', {
        $subject: user.$id,
        exp: sessionExpires,
        admin: false,
        tokens: [
          tokenStringify(tokenAccess),
        ],
        name: user.name,
        org: user.organization || '',
        avatar: profile.avatar || null,
      });

      user.password = null;

      output.json.result = {
        user: [user],
        profile: [profile],
        session: [session],
      };

      output.cookies = {
        session: sessionEncode(session),
      };

      return output;
    },
    /**
     * API handler for creating new data in storage.
     */
    authorize: (input) => {
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
