import {
  AuthLogout, Io, IoProcess, StateDeleter, uidList, sessionKey,
} from '@amnis/core';
import { mwSession, mwValidate } from '../mw/index.js';

/**
 * Renews a session holder's session and access bearers.
 */
const process: IoProcess<
Io<AuthLogout, StateDeleter>
> = () => (
  async (input, output) => {
    const { session } = input;

    /**
     * Delete the session cookie.
     */
    output.cookies.authSession = undefined;

    /**
     * Tell the client to delete with the session other entities with the session removal.
     */
    if (session) {
      output.json.result = {
        [sessionKey]: uidList([session.$id]),
      };
    }

    return output;
  }
);

export const processAuthLogout = mwSession()(
  mwValidate('AuthLogout')(
    process,
  ),
);

export default { processAuthLogout };
