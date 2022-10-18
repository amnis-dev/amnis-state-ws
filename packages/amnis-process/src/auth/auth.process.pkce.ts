import type { StateCreate } from '@amnis/core/state/index.js';

import type { ApiProcess } from '../types.js';
import type { ApiAuthIOPkce } from './auth.types.js';
import { apiOutput } from '../api.js';
import { authMicrosoft } from './auth.pkce.microsoft.js';
import { authTwitter } from './auth.pkce.twitter.js';
import { mwValidate } from '../mw.validate.js';

const process: ApiProcess<ApiAuthIOPkce> = (context) => (
  async (input) => {
    const { store, database } = context;
    const { body } = input;

    const output = apiOutput<StateCreate>();
    const { platform, ...pkceAuth } = body;

    switch (platform) {
      case 'microsoft': {
        const pkceOutput = await authMicrosoft(store, database, pkceAuth);
        return pkceOutput;
      }
      case 'twitter': {
        const pkceOutput = await authTwitter(store, database, pkceAuth);
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
