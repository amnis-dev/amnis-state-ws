import {
  Io, ioOutput, IoProcess, AuthVerify,
} from '@amnis/core/index.js';
import { jwtVerify } from '../crypto/index.js';
import { mwValidate } from '../mw/index.js';

/**
 * Verifies the validity of an access token.
 */
export const process: IoProcess<
Io<AuthVerify, boolean>
> = () => (
  async (input) => {
    const { body: token } = input;
    const output = ioOutput<boolean>();

    output.json.result = false;

    if (!token) {
      return output;
    }

    const jwt = jwtVerify(token.jwt);

    if (!jwt) {
      return output;
    }

    output.json.result = true;
    return output;
  }
);

export const authProcessVerify = mwValidate('AuthVerify')(
  process,
);

export default authProcessVerify;
