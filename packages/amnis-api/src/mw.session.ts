import { sessionVerify } from '@amnis/auth/session.js';
import { apiOutput } from './api.js';
import type {
  ApiMiddleware,
} from './types.js';

/**
 * Ensures a JWT token is set.
 */
export const mwSession: ApiMiddleware = () => (next) => (context) => async (input) => {
  const { sessionEncoded } = input;

  if (!sessionEncoded) {
    const output = apiOutput();
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'A session has not been established.',
    });
    return output;
  }

  input.session = sessionVerify(sessionEncoded);

  if (!input.session) {
    const output = apiOutput();
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'The session is invalid.',
    });
    return output;
  }

  return next(context)(input);
};

export default { mwSession };
