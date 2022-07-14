import type { StateDelete } from '@amnis/core/state';
import { userKey } from '@amnis/core/user';
import { apiOutput } from '../api';
import type { ApiContextMethod } from '../types';
import type { ApiAuthProcessLogout } from './auth.types';

/**
 * Renews a session holder's session and access tokens.
 */
export const authProcessLogout: ApiContextMethod<ApiAuthProcessLogout> = () => (
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

export default { authProcessLogout };
