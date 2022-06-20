import { randomBytes } from 'crypto';
/**
 * Generate a random verifier string.
 */
export function cryptoRandomString(length = 128) {
  return randomBytes(length).toString('hex');
}

export default { cryptoRandomString };
