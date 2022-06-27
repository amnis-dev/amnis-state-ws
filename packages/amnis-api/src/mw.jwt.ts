import { jwtVerify } from '@amnis/auth/token';
import { apiOutput } from './api';
import type {
  ApiMiddleware,
} from './types';

/**
 * Ensures a JWT token is set.
 */
export const mwJwt: ApiMiddleware = (next) => (context) => async (input) => {
  const { jwtEncoded } = input;

  if (!jwtEncoded) {
    const output = apiOutput();
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'Access token is required.',
    });
    return output;
  }

  input.jwt = jwtVerify(jwtEncoded);

  if (!input.jwt) {
    const output = apiOutput();
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'Access token is invalid.',
    });
    return output;
  }

  return next(context)(input);
};

export default { mwJwt };
