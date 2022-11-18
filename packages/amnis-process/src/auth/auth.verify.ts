import {
  Io, ioOutput, IoProcess, AuthVerify,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';

/**
 * Verifies the validity of an access bearer.
 */
export const process: IoProcess<
Io<AuthVerify, boolean>
> = (context) => (
  async (input) => {
    const { body: bearer } = input;
    const output = ioOutput<boolean>();

    output.json.result = false;

    if (!bearer) {
      return output;
    }

    const jwt = await context.crypto.accessVerify(bearer.access);

    if ('level' in jwt) {
      output.json.logs.push(jwt);
      return output;
    }

    if ('exp' in jwt) {
      output.json.result = true;
    }
    return output;
  }
);

export const authProcessVerify = mwValidate('AuthVerify')(
  process,
);

export default authProcessVerify;
