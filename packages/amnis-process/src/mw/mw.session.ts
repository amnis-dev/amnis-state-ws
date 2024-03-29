import { IoMiddleware } from '@amnis/core';

/**
 * Ensures a JWT bearer is set.
 */
export const mwSession: IoMiddleware = () => (next) => (context) => async (input, output) => {
  const { sessionEncrypted } = input;

  if (!sessionEncrypted) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'A session has not been established.',
    });
    return output;
  }

  input.session = await context.crypto.sessionDecrypt(sessionEncrypted);

  if (!input.session) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'The session is invalid.',
    });
    return output;
  }

  return next(context)(input, output);
};

export default { mwSession };
