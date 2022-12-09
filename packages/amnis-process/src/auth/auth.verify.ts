import {
  Io, IoProcess, AuthVerify,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';

/**
 * Verifies the validity of an access bearer.
 */
export const process: IoProcess<
Io<AuthVerify, boolean>
> = (context) => (
  async (input, output) => {
    const { body: bearer } = input;

    output.json.result = false;

    if (!bearer) {
      return output;
    }

    const jwt = await context.crypto.accessVerify(bearer.access);

    if (jwt !== undefined) {
      output.json.result = true;
    }

    return output;
  }
);

export const authProcessVerify = mwValidate('AuthVerify')(
  process,
);

export default authProcessVerify;
