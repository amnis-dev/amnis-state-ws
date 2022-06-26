import { jwtVerify } from '@amnis/auth/token';
import { apiOutput } from './api';
import type {
  ApiContext, ApiContextMethod, ApiInput,
} from './types';

/**
 * Ensures a JWT token is set.
 */
export const mwJwt = (next: ApiContextMethod) => (
  (context: ApiContext) => async (input: ApiInput) => {
    const { jwtEncoded } = input;

    if (!jwtEncoded) {
      const output = apiOutput();
      output.status = 401; // 401 Unauthorized
      output.json.errors = [
        {
          title: 'Unauthorized',
          message: 'Access token is required.',
        },
      ];
      return output;
    }

    input.jwt = jwtVerify(jwtEncoded);

    if (!input.jwt) {
      const output = apiOutput();
      output.status = 401; // 401 Unauthorized
      output.json.errors = [
        {
          title: 'Unauthorized',
          message: 'Access token is invalid.',
        },
      ];
      return output;
    }

    return next(context)(input);
  }
);

export default { mwJwt };
