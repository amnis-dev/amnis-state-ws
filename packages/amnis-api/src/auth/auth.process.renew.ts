import { AUTH_SESSION_LIFE } from '@amnis/auth/const';
import { sessionEncode } from '@amnis/auth/session';
import { dateNumeric } from '@amnis/core/core';
import { sessionCreate } from '@amnis/core/session';
import { StateUpdate } from '@amnis/core/state';
import { apiOutput } from '../api';
import { ApiContextMethod } from '../types';
import { ApiAuthProcessRenew } from './auth.types';
import { tokenGenerate, userFindById } from './auth.utility';

/**
 * Renews a session holder's session and access tokens.
 */
export const authProcessRenew: ApiContextMethod = (context): ApiAuthProcessRenew => (
  async (input) => {
    const { database } = context;
    const { session } = input;
    const output = apiOutput<StateUpdate>();

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
      return output;
    }

    /**
     * Create new tokens for access.
     */
    const token = tokenGenerate(user, 'access');

    /**
     * Create a new session.
     */
    const [sessionNew] = sessionCreate({
      $subject: session.$subject,
      exp: dateNumeric(AUTH_SESSION_LIFE),
      name: session.name,
      avatar: session.avatar,
      admin: session.admin,
    }, true);

    output.cookies.authSession = sessionEncode(sessionNew);

    output.json.result = {
      session: [sessionNew],
    };

    output.json.tokens = [token];

    return output;
  }
);

export default authProcessRenew;
