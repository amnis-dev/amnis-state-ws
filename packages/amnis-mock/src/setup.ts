import type { CryptoSymEncryption, IoInput } from '@amnis/core';
import { httpAuthorizationParse } from '@amnis/process';
import type { DefaultBodyType, PathParams, RestRequest } from 'msw';

export type Request = RestRequest<DefaultBodyType, PathParams<string>>;

/**
 * Sets up the input object for processors.
 */
export const setupInput = async (req: Request): Promise<IoInput> => {
  /**
   * Extract body and authSession data from the request.
   */
  const body = await req.json();
  const { authSession } = req.cookies;

  /**
   * Build the input object.
   */
  const input: IoInput = {
    body: body ?? {},
    sessionEncryption: authSession as CryptoSymEncryption,
  };

  /**
   * Extract authorization header.
   */
  const authorization = req.headers.get('Authorization');
  input.accessEncoded = httpAuthorizationParse(authorization);

  return input;
};
