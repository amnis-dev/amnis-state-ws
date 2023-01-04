import {
  Io,
  IoProcess,
  ioOutputApply,
  ApiAuthChallenge,
  Challenge,
  Entity,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { mwValidate } from '../mw/index.js';
import { challengeNew } from '../utility/challenge.js';

const process: IoProcess<
Io<ApiAuthChallenge, Challenge>
> = (context) => (
  async (input, output) => {
    const { store } = context;
    const system = systemSelectors.selectActive(store.getState());

    if (!system) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to generate a challenge.',
      });
      return output;
    }

    ioOutputApply(output, await challengeNew(context));
    return output;
  }
);

export const processAuthChallenge = mwValidate('ApiAuthChallenge')(
  process,
) as IoProcess<
Io<ApiAuthChallenge, Entity<Challenge>>
>;

export default { processAuthChallenge };
