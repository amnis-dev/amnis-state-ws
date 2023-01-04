import {
  Io,
  IoProcess,
  ApiAuthAuthenticate,
  StateEntities,
  ioOutputApply,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import {
  mwValidate,
  mwSession,
  mwChallenge,
  mwSignature,
  mwCredential,
} from '../mw/index.js';
import { authenticateFinalize, findUserById } from '../utility/index.js';

const process: IoProcess<
Io<ApiAuthAuthenticate, StateEntities>
> = (context) => (
  async (input, output) => {
    const { store } = context;
    const { session } = input;

    if (!session) {
      return output;
    }

    /**
     * Get the active system.
     */
    const system = systemSelectors.selectActive(store.getState());

    if (!system) {
      output.status = 503; // 503 Service Unavailable
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to authenticate.',
      });
      return output;
    }

    /**
     * Getting here means all the authentication checks were valid.
     * The session holder can be logged in.
     */
    const user = await findUserById(context, session.$subject);

    if (!user) {
      output.status = 500; // 500 Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'User Not Found',
        description: 'Could not find the user described in the session.',
      });
      return output;
    }

    ioOutputApply(output, await authenticateFinalize(context, user.$id, session.$credential));

    return output;
  }
);

export const processAuthAuthenticate = mwValidate('ApiAuthAuthenticate')(
  mwSession()(
    mwChallenge()(
      mwCredential()(
        mwSignature()(
          process,
        ),
      ),
    ),
  ),
) as IoProcess<
Io<ApiAuthAuthenticate, StateEntities>
>;

export default { processAuthAuthenticate };
