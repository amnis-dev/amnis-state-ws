import {
  Io,
  IoProcess,
  ioOutputApply,
  ApiAuthChallenge,
  logCreator,
  Challenge,
  Entity,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { mwValidate } from '../mw/index.js';
import { challengeCreate } from '../utility/challenge.js';

const process: IoProcess<
Io<ApiAuthChallenge, Entity<Challenge>>
> = (context) => (
  async (input, output) => {
    const { store, crypto } = context;
    const { body, sessionEncryption } = input;
    const system = systemSelectors.selectActive(store.getState());

    if (!system) {
      output.status = 500;
      output.json.logs.push(logCreator({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to generate a challenge.',
      }));
      return output;
    }

    const { username, privatize } = body;

    if (username === undefined && privatize === undefined) {
      ioOutputApply(output, await challengeCreate(context));
      return output;
    }

    if (!sessionEncryption) {
      output.status = 401;
      output.json.logs.push(logCreator({
        level: 'error',
        title: 'Unauthorized Challange Creation',
        description: 'Must be logged in to create this challenge.',
      }));
      return output;
    }

    const session = await crypto.sessionDecrypt(sessionEncryption);

    if (session?.prv !== true) {
      output.status = 401;
      output.json.logs.push(logCreator({
        level: 'error',
        title: 'Unauthorized Challange Creation',
        description: 'Account not authorized to create a challenge in this way.',
      }));
      return output;
    }

    ioOutputApply(output, await challengeCreate(context, { username, privatize }));
    return output;
  }
);

export const processAuthChallenge = mwValidate('ApiAuthChallenge')(
  process,
);

export default { processAuthChallenge };
