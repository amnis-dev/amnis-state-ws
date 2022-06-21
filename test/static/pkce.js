/* eslint-disable no-undef */
/**
 * Generate a random verifier string.
 */
window.pkceRandomString = (length = 128) => {
  const array = new Uint32Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => (`0${dec.toString(16)}`).slice(-2)).join('');
};

// Base64-urlencodes the input string
window.base64urlencode = (value) => (
  window.btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(value))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
);

/**
 * Encrypt with SHA-256.
 */
window.sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return base64urlencode(hash);
};

window.pkceGetState = (renew = false) => {
  const storageState = sessionStorage.getItem('pkceState');
  if (renew || !storageState || storageState.length < 64) {
    const newPkceState = pkceRandomString(64);
    sessionStorage.setItem('pkceState', newPkceState);
    return newPkceState;
  }
  return storageState;
};

window.pkceGetVerifier = (renew = false) => {
  const storageVerifier = sessionStorage.getItem('pkceVerifier');
  if (renew || !storageVerifier || storageVerifier.length < 64) {
    const newPkceVerifier = pkceRandomString();
    sessionStorage.setItem('pkceVerifier', newPkceVerifier);
    return newPkceVerifier;
  }
  return storageVerifier;
};

window.pkceCreateChallenge = async (verifier) => {
  const challenge = await sha256(verifier);
  return challenge;
};

window.setAuthPlatform = (platform) => {
  sessionStorage.setItem('authPlatform', platform);
};

window.getAuthPlatform = () => sessionStorage.getItem('authPlatform');
