import { apiOutput } from '../api';
import { ApiContextMethod } from '../types';
import { authMicrosoft } from './auth.microsoft';
import { authTwitter } from './auth.twitter';
import { ApiAuthProcessPkce } from './auth.types';

export const authProcessPcke: ApiContextMethod = (context): ApiAuthProcessPkce => (
  async (input) => {
    const { database } = context;
    const { body } = input;

    const output = apiOutput();
    const { platform, ...pkceAuth } = body;

    switch (platform) {
      case 'microsoft': {
        const pkceOutput = await authMicrosoft(database, pkceAuth);
        return pkceOutput;
      }
      case 'twitter': {
        const pkceOutput = await authTwitter(database, pkceAuth);
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

export default authProcessPcke;
