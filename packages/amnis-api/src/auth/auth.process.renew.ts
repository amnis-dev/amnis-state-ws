import { AUTH_SESSION_LIFE } from '@amnis/auth/const';
import { sessionEncode } from '@amnis/auth/session';
import { dateNumeric } from '@amnis/core/core';
import { profileKey } from '@amnis/core/profile';
import { sessionCreate, sessionKey } from '@amnis/core/session';
import type { StateCreate } from '@amnis/core/state';
import { userKey } from '@amnis/core/user';
import { apiOutput } from '../api';
import { ApiContextMethod } from '../types';
import { ApiAuthProcessRenew } from './auth.types';
import { profileFetch, tokenGenerate, userFindById } from './auth.utility';

/**
 * Renews a session holder's session and access tokens.
 */
export const authProcessRenew: ApiContextMethod = (context): ApiAuthProcessRenew => (
  async (input) => {
    const { database } = context;
    const { session, body } = input;
    const { info } = body;
    const output = apiOutput<StateCreate>();
    output.json.result = {};

    if (!session) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Session could not be processed.',
      });
      output.json.result = undefined;
      return output;
    }

    /**
     * Find user by ID
     */
    const user = await userFindById(database, session.$subject);

    if (!user) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Missing User',
        description: 'The session holder\'s user account could not be found.',
      });
      output.json.result = undefined;
      return output;
    }

    if (info === true) {
      const profile = await profileFetch(database, user);

      if (!profile) {
        output.status = 500; // Internal Server Error
        output.json.logs.push({
          level: 'error',
          title: 'Profile Missing',
          description: 'Could not find the account profile.',
        });
        output.json.result = undefined;
        return output;
      }

      output.json.result[userKey] = [user];
      output.json.result[profileKey] = [profile];
    }

    /**
     * Create new tokens for access.
     */
    const token = tokenGenerate(user, 'access');

    /**
     * Create a new session.
     */
    const sessionNew = sessionCreate({
      $subject: session.$subject,
      exp: dateNumeric(AUTH_SESSION_LIFE),
      name: session.name,
      avatar: session.avatar,
      admin: session.admin,
    });

    output.cookies.authSession = sessionEncode(sessionNew);

    output.json.result[sessionKey] = [sessionNew];

    output.json.tokens = [token];

    return output;
  }
);

export default { authProcessRenew };
