import { jwtVerify } from '@amnis/auth/token';
import { apiOutput } from '../api';
import { mwValidate } from '../mw.validate';
import { ApiProcess } from '../types';
import { ApiAuthIOVerify } from './auth.types';

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
