import { jwtVerify } from '@amnis/auth/token';
import { selectors } from '@amnis/core/selectors';
import { apiOutput } from './api';
import { apiConfig } from './config';
import type {
  ApiMiddleware,
} from './types';

/**
 * Ensures a JWT token is set.
 */
export const mwJwt: ApiMiddleware = () => (next) => (context) => async (input) => {
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

  /**
   * Fetch the auth service public key from the store.
   */
  const publicKey = selectors.selectPublicKey(
    context.store.getState(),
    apiConfig.API_AUTH_CRYPTO_TAG,
  );

  input.jwt = jwtVerify(jwtEncoded, publicKey);

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
