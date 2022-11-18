import type { CryptoRandomString } from '@amnis/core';

/**
 * Generate a random verifier string.
 */
export const randomString: CryptoRandomString = async (length = 128) => {
  const bytes = new Uint8Array(length);
  return Buffer.from(window.crypto.getRandomValues(bytes)).toString('hex');
};

export default randomString;
