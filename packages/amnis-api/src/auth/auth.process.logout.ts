import type { StateDelete } from '@amnis/core/state';
import { userKey } from '@amnis/core/user';
import { apiOutput } from '../api';
import { mwSession } from '../mw.session';
import { mwValidate } from '../mw.validate';
import type { ApiProcess } from '../types';
import type { ApiAuthIOLogout } from './auth.types';

/**
 * Renews a session holder's session and access tokens.
 */
const process: ApiProcess<ApiAuthIOLogout> = () => (
  async (input) => {
    const { session } = input;
    const output = apiOutput<StateDelete>();

    /**
     * Delete the session cookie.
     */
    output.cookies.authSession = undefined;

    /**
     * Tell the client to delete with the session other entities with the session removal.
     */
    if (session) {
      output.json.result = {
        [userKey]: [session.$subject],
      };
    }

    return output;
  }
);

export const authProcessLogout = mwSession()(
  mwValidate('ApiAuthBodyLogout')(
    process,
  ),
);

export default { authProcessLogout };
