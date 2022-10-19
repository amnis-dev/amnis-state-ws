/**
 * Generate a random verifier string.
 */
export function pkceRandomString(length = 128) {
  const array = new Uint32Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => (`0${dec.toString(16)}`).slice(-2)).join('');
}

// Base64-urlencodes the input string
export function base64urlencode(value: ArrayBuffer) {
  return window.btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(value))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Encrypt with SHA-256.
 */
export async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return base64urlencode(hash);
}

/**
 * Gets a state code.
 */
export function pkceGetState(renew = false) {
  const storageState = sessionStorage.getItem('pkceState');
  if (renew || !storageState || storageState.length < 64) {
    const newPkceState = pkceRandomString(64);
    sessionStorage.setItem('pkceState', newPkceState);
    return newPkceState;
  }
  return storageState;
}

/**
 * Gets the PKCE Verification string.
 */
export function pkceGetVerifier(renew = false) {
  const storageVerifier = sessionStorage.getItem('pkceVerifier');
  if (renew || !storageVerifier || storageVerifier.length < 64) {
    const newPkceVerifier = pkceRandomString();
    sessionStorage.setItem('pkceVerifier', newPkceVerifier);
    return newPkceVerifier;
  }
  return storageVerifier;
}

/**
 * Creates a PKCE challenge key.
 */
export async function pkceCreateChallenge(verifier: string) {
  const challenge = await sha256(verifier);
  return challenge;
}

/**
 * Set the auth platform being used.
 */
export function pkceSetAuthPlatform(platform: string) {
  sessionStorage.setItem('authPlatform', platform);
}

/**
 * Gets the current auth platform being used.
 */
export function pkceGetAuthPlatform() {
  return sessionStorage.getItem('authPlatform');
}

/**
 * Set the auth platform being used.
 */
export function pkceSetAuthPlatformCode(code: string) {
  sessionStorage.setItem('authPlatformCode', code);
}

/**
 * Gets the current auth platform being used.
 */
export function pkceGetAuthPlatformCode() {
  return sessionStorage.getItem('authPlatformCode');
}
