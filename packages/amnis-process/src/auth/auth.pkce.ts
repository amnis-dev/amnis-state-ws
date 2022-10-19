import {
  AuthPkce,
  Io,
  ioOutput,
  IoProcess,
  StateCreate,
} from '@amnis/core/index.js';
import { oauthTwitter, oauthMicrosoft } from '../utility/index.js';
import { mwValidate } from '../mw/index.js';

const process: IoProcess<
Io<AuthPkce, StateCreate>
> = (context) => (
  async (input) => {
    const { store, database } = context;
    const { body } = input;

    const output = ioOutput<StateCreate>();
    const { platform, ...pkceAuth } = body;

    switch (platform) {
      case 'microsoft': {
        const pkceOutput = await oauthMicrosoft(store, database, pkceAuth);
        return pkceOutput;
      }
      case 'twitter': {
        const pkceOutput = await oauthTwitter(store, database, pkceAuth);
        return pkceOutput;
      }
      default:
        output.status = 401; // Unauthorized
        output.json.logs.push({
          level: 'error',
          title: 'Unknown Platform',
          description: `Could not authenticate using the '${platform}' platform.`,
        });
        return output;
    }
  }
);

export const authProcessPcke = mwValidate('ApiAuthBodyPkce')(
  process,
);

export default { authProcessPcke };
