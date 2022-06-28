import { jwtVerify } from '@amnis/auth/token';
import { tokenParse } from '@amnis/core/token';
import { apiOutput } from '../api';
import { ApiContextMethod } from '../types';
import { ApiAuthProcessVerify } from './auth.types';

/**
 * Verifies the validity of an access token.
 */
export const authProcessVerify: ApiContextMethod = (): ApiAuthProcessVerify => (
  async (input) => {
    const { body } = input;
    const output = apiOutput();
    output.json.result = false;

    const token = tokenParse(body.token);

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

export default authProcessVerify;
