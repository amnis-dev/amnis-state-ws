import { randomBytes, createHash } from 'crypto';

/**
 * Generate a random verifier string.
 */
export function pkceCreateVerifier(length = 128) {
  return randomBytes(length).toString('hex');
}

// Base64-urlencodes the input string
export function base64urlencode(value: ArrayBuffer) {
  return Buffer.from(value).toString('base64');
}

/**
 * Encrypt with SHA-256.
 */
export async function sha256(plain: string) {
  return createHash('sha256').update(plain).digest('base64url');
}

const pkceVerifier = pkceCreateVerifier();

export function pkceGetVerifier() {
  return pkceVerifier;
}

export async function pkceCreateChallenge(verifier: string) {
  const challenge = await sha256(verifier);
  return challenge;
}
