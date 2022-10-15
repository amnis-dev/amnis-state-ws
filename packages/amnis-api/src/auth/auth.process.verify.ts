import { jwtVerify } from '@amnis/auth/token.js';
import { apiOutput } from '../api.js';
import { mwValidate } from '../mw.validate.js';
import { ApiProcess } from '../types.js';
import { ApiAuthIOVerify } from './auth.types.js';

/**
 * Verifies the validity of an access token.
 */
export const process: ApiProcess<ApiAuthIOVerify> = () => (
  async (input) => {
    const { body: token } = input;
    const output = apiOutput<boolean>();

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

export const authProcessVerify = mwValidate('ApiAuthBodyVerify')(
  process,
);

export default { authProcessVerify };
