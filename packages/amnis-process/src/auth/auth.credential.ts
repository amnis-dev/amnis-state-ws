import {
  Io,
  IoProcess,
  ApiAuthChallenge,
  Challenge,
  Entity,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';

const process: IoProcess<
Io<ApiAuthChallenge, Entity<Challenge>>
> = (context) => (
  async (input, output) => {
    const { store } = context;

    return output;
  }
);

export const processAuthChallenge = mwValidate('ApiAuthChallenge')(
  process,
) as IoProcess<
Io<ApiAuthChallenge, Entity<Challenge>>
>;

export default { processAuthChallenge };
