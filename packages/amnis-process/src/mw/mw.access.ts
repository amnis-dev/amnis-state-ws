import { ioOutput, IoMiddleware, selectPublicKey } from '@amnis/core';
import { processConfig } from '../config.js';

/**
 * Ensures a JWT bearer is set.
 */
export const mwAccess: IoMiddleware = () => (next) => (context) => async (input) => {
  const { accessEncoded } = input;

  if (!accessEncoded) {
    const output = ioOutput();
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'Access bearer is required.',
    });
    return output;
  }

  /**
   * Fetch the auth service public key from the store.
   */
  const publicKey = selectPublicKey(
    context.store.getState(),
    processConfig.PROCESS_CRYPTO_TAG,
  );

  input.access = await context.crypto.accessVerify(accessEncoded, publicKey);

  if (!input.access) {
    const output = ioOutput();
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'Access bearer is invalid.',
    });
    return output;
  }

  return next(context)(input);
};

export default { mwAccess };
