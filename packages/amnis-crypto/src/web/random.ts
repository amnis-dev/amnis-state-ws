import type { CryptoRandomString } from '@amnis/core';
import { base64Encode } from '../utility.js';
import { webcrypto } from '../webcrypto.js';
/**
 * Generate a random verifier string.
 */
export const randomString: CryptoRandomString = async (length = 128) => {
  const wc = await webcrypto();
  const random = wc.getRandomValues(new Uint8Array(length));
  const data = base64Encode(random);
  return data;
};

export default randomString;
