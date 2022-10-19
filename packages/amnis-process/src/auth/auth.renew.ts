import {
  AuthRenew,
  dateNumeric,
  profileKey,
  sessionCreate,
  sessionKey, StateCreate,
  userKey,
  IoProcess,
  Io,
  ioOutput,
} from '@amnis/core/index.js';
import { processConfig } from '../config.js';
import { sessionEncode } from '../crypto/index.js';
import { mwSession, mwValidate } from '../mw/index.js';
import { profileFetch, tokenGenerate, userFindById } from '../utility/common.js';

/**
 * Renews a session holder's session and access tokens.
 */
const process: IoProcess<
Io<AuthRenew, StateCreate>
> = (context) => (
  async (input) => {
    const { database } = context;
    const { session, body } = input;
    const { info } = body;
    const output = ioOutput<StateCreate>();
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
      exp: dateNumeric(processConfig.PROCESS_SESSION_LIFE),
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
