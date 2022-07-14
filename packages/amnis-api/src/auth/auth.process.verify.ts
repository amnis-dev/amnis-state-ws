import { jwtVerify } from '@amnis/auth/token';
import { apiOutput } from '../api';
import { ApiContextMethod } from '../types';
import { ApiAuthProcessVerify } from './auth.types';

/**
 * Verifies the validity of an access token.
 */
export const authProcessVerify: ApiContextMethod<ApiAuthProcessVerify> = () => (
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

export default { authProcessVerify };
