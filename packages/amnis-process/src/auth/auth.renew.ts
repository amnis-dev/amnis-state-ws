import {
  AuthRenew,
  dateNumeric,
  profileKey,
  sessionCreator,
  sessionKey,
  userKey,
  IoProcess,
  Io,
  ioOutput,
  StateEntities,
  entityCreate,
} from '@amnis/core';
import { processConfig } from '../config.js';
import { mwSession, mwValidate } from '../mw/index.js';

/**
 * Renews a session holder's session and access bearers.
 */
const process: IoProcess<
Io<AuthRenew, StateEntities>
> = (context) => (
  async (input) => {
    const { database, crypto } = context;
    const { session, body } = input;
    const { info } = body;
    const output = ioOutput<StateEntities>();
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
     * Create a new bearer for access.
     */
    const bearer = await bearerGenerate(user, context);

    /**
     * Create a new session.
     */
    const sessionNew = sessionCreator({
      $subject: session.$subject,
      exp: dateNumeric(processConfig.PROCESS_SESSION_LIFE),
      name: session.name,
      avatar: session.avatar,
      admin: session.admin,
    });

    output.cookies.authSession = await crypto.sessionEncrypt(sessionNew);

    output.json.result[sessionKey] = [entityCreate(
      sessionNew,
      { $owner: session.$subject, $creator: session.$subject },
    )];

    output.json.bearers = [bearer];

    return output;
  }
);

export const authProcessRenew = mwSession()(mwValidate('AuthRenew')(process));

export default { authProcessRenew };
