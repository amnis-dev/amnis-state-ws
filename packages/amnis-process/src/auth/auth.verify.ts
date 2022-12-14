import {
  Io, IoProcess, ApiAuthVerify,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';

/**
 * Verifies the validity of an access bearer.
 */
export const process: IoProcess<
Io<ApiAuthVerify, boolean>
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

export const processAuthVerify = mwValidate('ApiAuthVerify')(
  process,
);

export default processAuthVerify;
