import {
  Io,
  IoProcess,
  StateEntities,
  ApiAuthCreate,
  ioOutputApply,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import {
  mwChallenge, mwCredential, mwSession, mwSignature, mwValidate,
} from '../mw/index.js';
import { accountCreate } from '../utility/account.js';

const process: IoProcess<
Io<ApiAuthCreate, StateEntities>
> = (context) => (
  async (input, output) => {
    const { store } = context;
    const { body, session } = input;
    const system = systemSelectors.selectActive(store.getState());

    if (!session) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Session Required',
        description: 'A session is required to proceed with account creation.',
      });
      return output;
    }

    if (!system) {
      output.status = 503;
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available for account creation.',
      });
      return output;
    }

    if (session.prv !== true) {
      output.status = 401;
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Not authorized to create accounts.',
      });
      return output;
    }

    /**
     * Since all else checks out, create the account.
     */
    ioOutputApply(output, await accountCreate(context, body));

    return output;
  }
);

export const processAuthCreate = mwValidate('ApiAuthCreate')(
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
Io<ApiAuthCreate, StateEntities>
>;

export default { processAuthCreate };
