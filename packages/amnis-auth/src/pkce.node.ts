import { sha256, cryptoRandomString } from './crypto';

// Base64-urlencodes the input string
export function base64urlencode(value: ArrayBuffer) {
  return Buffer.from(value).toString('base64');
}

const pkceVerifier = cryptoRandomString(128);

export function pkceGetVerifier() {
  return pkceVerifier;
}

export async function pkceCreateChallenge(verifier: string) {
  const challenge = await sha256(verifier);
  return challenge;
}
