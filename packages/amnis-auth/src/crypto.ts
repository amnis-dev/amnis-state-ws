import { createHash, randomBytes } from 'crypto';
/**
 * Generate a random verifier string.
 */
export function cryptoRandomString(length = 128) {
  return randomBytes(length).toString('hex');
}

/**
 * Encrypt with SHA-256.
 */
export async function sha256(plain: string) {
  return createHash('sha256').update(plain).digest('base64url');
}

export default { sha256, cryptoRandomString };
