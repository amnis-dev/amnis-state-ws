import Ajv from 'ajv';
import type {
  JWTDecoded,
  ResultCreate, Session, Token, User,
} from '@amnis/core/types';
import { jwtEncode, passCompareSync, sessionEncode } from '@amnis/auth/index';
import { dateNumeric, reference, tokenStringify } from '@amnis/core/core';
import { nanoid } from '@reduxjs/toolkit';
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
      });

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

      const expires = dateNumeric(new Date(Date.now() + 30 * 60000));

      /**
       * Create the JWT access token.
       */
      const jwtDecoded: JWTDecoded = {
        iss: '',
        sub: user.$id,
        exp: expires,
        iat: expires,
        typ: 'access',
        roles: [],
      };

      /**
       * Create token container for the jwt.
       */
      const token: Token = {
        $id: reference('token', nanoid()),
        api: 'Core',
        exp: expires,
        jwt: jwtEncode(jwtDecoded),
        type: 'access',
      };

      /**
       * Create the new user session.
       */
      const session: Session = {
        $id: reference('session', nanoid()),
        $subject: user.$id,
        exp: expires,
        admin: false,
        tokens: [
          tokenStringify(token),
        ],
        displayName: '',
        org: '',
        avatar: null,
      };

      user.password = '';

      output.json.result = {
        user: [user],
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
