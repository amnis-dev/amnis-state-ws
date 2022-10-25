import { selectors, ioOutput, IoMiddleware } from '@amnis/core';
import { jwtVerify } from '../crypto/index.js';
import { processConfig } from '../config.js';

/**
 * Ensures a JWT token is set.
 */
export const mwJwt: IoMiddleware = () => (next) => (context) => async (input) => {
  const { jwtEncoded } = input;

  if (!jwtEncoded) {
    const output = ioOutput();
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'Access token is required.',
    });
    return output;
  }

  /**
   * Fetch the auth service public key from the store.
   */
  const publicKey = selectors.selectPublicKey(
    context.store.getState(),
    processConfig.PROCESS_CRYPTO_TAG,
  );

  input.jwt = jwtVerify(jwtEncoded, publicKey);

  if (!input.jwt) {
    const output = ioOutput();
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
