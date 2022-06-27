import { AUTH_SESSION_LIFE, AUTH_TOKEN_LIFE } from '@amnis/auth/const';
import { sessionEncode } from '@amnis/auth/session';
import { jwtDecode, jwtEncode } from '@amnis/auth/token';
import { dateNumeric } from '@amnis/core/core';
import { sessionCreate } from '@amnis/core/session';
import {
  JWTDecoded, Token, tokenParse, tokenStringify,
} from '@amnis/core/token';
import { apiOutput } from '../api';
import { ApiContextMethod } from '../types';
import { ApiAuthProcessRenew } from './auth.types';

/**
 * Renews a session holder's session and access tokens.
 */
export const authProcessRenew: ApiContextMethod = (context): ApiAuthProcessRenew => (
  async (input) => {
    const { session } = input;
    const output = apiOutput();

    if (!session) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Session could not be processed.',
      });
      return output;
    }

    /**
     * Decode old access token.
     */
    const jwtAccessOldSearch = session.tokens.find((token) => token.startsWith('core:access:'));

    if (!jwtAccessOldSearch) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Session Token Missing',
        description: 'The core access token has not been established on the session.',
      });
      return output;
    }

    const jwtAccessOldParsed = tokenParse(jwtAccessOldSearch);

    if (!jwtAccessOldParsed) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Session Token Invalid',
        description: 'The core access token on the session is poorly formatted.',
      });
      return output;
    }

    const jwtAccessOld = jwtDecode(jwtAccessOldParsed.jwt);

    if (!jwtAccessOld) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Session Token Issue',
        description: 'The cor',
      });
      return output;
    }

    /**
     * Create a new access token
     */
    const jwtDecoded: JWTDecoded = {
      iss: '',
      sub: jwtAccessOld.sub,
      exp: dateNumeric(AUTH_TOKEN_LIFE),
      typ: 'access',
      roles: jwtAccessOld.roles,
    };

    const tokenAccess: Token = {
      api: 'core',
      exp: dateNumeric(AUTH_TOKEN_LIFE),
      jwt: jwtEncode(jwtDecoded),
      type: 'access',
    };

    const newAccessToken = tokenStringify(tokenAccess);

    /**
     * Create a new session.
     */
    const [sessionNew] = sessionCreate({
      $subject: session.$subject,
      exp: dateNumeric(AUTH_SESSION_LIFE),
      name: session.name,
      avatar: session.avatar,
      admin: session.admin,
      tokens: [newAccessToken],
    }, true);

    output.cookies.session = sessionEncode(sessionNew);

    output.json.result = {
      session: [sessionNew],
    };

    return output;
  }
);

export default authProcessRenew;
