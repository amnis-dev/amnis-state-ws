import type { StateCreate } from '@amnis/core/state';

import type { ApiProcess } from '../types';
import type { ApiAuthIOPkce } from './auth.types';
import { apiOutput } from '../api';
import { authMicrosoft } from './auth.pkce.microsoft';
import { authTwitter } from './auth.pkce.twitter';
import { mwValidate } from '../mw.validate';

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

export const authProcessPcke = mwValidate('ApiAuthBodyPkce')(process);

export default { authProcessPcke };
