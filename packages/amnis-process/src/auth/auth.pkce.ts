import {
  ApiAuthPkce,
  Io,
  ioOutput,
  IoProcess,
  StateEntities,
} from '@amnis/core';
import { oauthTwitter, oauthMicrosoft } from '../utility/index.js';
import { mwValidate } from '../mw/index.js';

const process: IoProcess<
Io<ApiAuthPkce, StateEntities>
> = (context) => (
  async (input) => {
    const { body } = input;

    const output = ioOutput<StateEntities>();
    const { platform, ...pkceAuth } = body;

    switch (platform) {
      case 'microsoft': {
        const pkceOutput = await oauthMicrosoft(context, pkceAuth);
        return pkceOutput;
      }
      case 'twitter': {
        const pkceOutput = await oauthTwitter(context, pkceAuth);
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

export const processAuthPcke = mwValidate('ApiAuthPkce')(
  process,
);

export default { processAuthPcke };
