import { cryptConfig } from '@amnis/auth/config.js';
import { sessionEncode } from '@amnis/auth/session.js';
import { dateNumeric } from '@amnis/core/core.js';
import { profileKey } from '@amnis/core/profile/index.js';
import { sessionCreate, sessionKey } from '@amnis/core/session/index.js';
import type { StateCreate } from '@amnis/core/state/index.js';
import { userKey } from '@amnis/core/user/index.js';
import { apiOutput } from '../api.js';
import { ApiProcess } from '../types.js';
import { ApiAuthIORenew } from './auth.types.js';
import { profileFetch, tokenGenerate, userFindById } from './auth.utility.js';
import { mwSession } from '../mw.session.js';
import { mwValidate } from '../mw.validate.js';

/**
 * Renews a session holder's session and access tokens.
 */
const process: ApiProcess<ApiAuthIORenew> = (context) => (
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
      exp: dateNumeric(cryptConfig.AUTH_SESSION_LIFE),
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

export const authProcessRenew = mwSession()(mwValidate('ApiAuthBodyRenew')(process));

export default { authProcessRenew };
