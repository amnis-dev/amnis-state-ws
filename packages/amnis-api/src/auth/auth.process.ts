import Ajv from 'ajv';
import type {
  JWTDecoded,
  ResultCreate, Session, Token, User,
} from '@amnis/core/types';
import {
  AUTH_SESSION_LIFE,
  AUTH_TOKEN_LIFE,
  jwtEncode,
  passCompareSync,
  sessionEncode,
} from '@amnis/auth/index';
import {
  dateNumeric, entityCreate, tokenStringify,
} from '@amnis/core/core';
import authSchema from './auth.schema.json';
import { apiOutput, apiValidate } from '../api';
import type {
  ApiAuthProcesses, ApiAuthProcessesParams,
} from './auth.types';

/**
 * Helper function to produce an invalid login error.
 */
function badCredentials() {
  const output = apiOutput();

  output.status = 401; // 401 Unauthorized
  output.json.errors = [
    {
      title: 'Bad Credentials',
      message: 'Username or password is incorrect.',
    },
  ];
  return output;
}

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

      const { username, password } = body;

      const results = database.read({
        user: {
          $query: {
            name: {
              $eq: username,
            },
          },
        },
      }, { user: 'global' });

      if (!results.user?.length) {
        return badCredentials();
      }

      const user = { ...results.user[0] } as User;

      if (user.password === null) {
        return badCredentials();
      }

      const same = passCompareSync(password, user.password);

      if (same === false) {
        return badCredentials();
      }

      const tokenExpires = dateNumeric(AUTH_TOKEN_LIFE);
      const sessionExpires = dateNumeric(AUTH_SESSION_LIFE);

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
      const session = entityCreate<Session>('session', {
        $subject: user.$id,
        exp: sessionExpires,
        admin: false,
        tokens: [
          tokenStringify(tokenAccess),
        ],
        displayName: user.name,
        org: user.organization || '',
        avatar: null,
      });

      user.password = null;

      output.json.result = {
        user: [user],
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
