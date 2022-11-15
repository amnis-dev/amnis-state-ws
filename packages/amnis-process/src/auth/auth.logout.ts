import {
  userKey, AuthLogout, Io, ioOutput, IoProcess, StateDelete, uidList,
} from '@amnis/core';
import { mwSession, mwValidate } from '../mw/index.js';

/**
 * Renews a session holder's session and access bearers.
 */
const process: IoProcess<
Io<AuthLogout, StateDelete>
> = () => (
  async (input) => {
    const { session } = input;
    const output = ioOutput<StateDelete>();

    /**
     * Delete the session cookie.
     */
    output.cookies.authSession = undefined;

    /**
     * Tell the client to delete with the session other entities with the session removal.
     */
    if (session) {
      output.json.result = {
        [userKey]: uidList([session.$subject]),
      };
    }

    return output;
  }
);

export const authProcessLogout = mwSession()(
  mwValidate('AuthLogout')(
    process,
  ),
);

export default { authProcessLogout };
