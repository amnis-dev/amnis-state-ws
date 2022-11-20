import { CryptoPassCompare, CryptoPassHash, CryptoPassword } from '@amnis/core';
import { webcrypto } from '../webcrypto.js';

const passEncrypt = async (password: string, salt: Uint8Array) => {
  const wc = await webcrypto();
  const passEncoded = new TextEncoder().encode(password);
  const passKey = await wc.subtle.importKey('raw', passEncoded, 'PBKDF2', false, ['deriveBits']);

  const derivedBits = await wc.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 1e6,
      hash: 'SHA-256',
    },
    passKey,
    256,
  );

  const saltArray = Array.from(new Uint8Array(salt));
  const derivedArray = Array.from(new Uint8Array(derivedBits));
  const composite = saltArray.concat(derivedArray).map((byte) => String.fromCharCode(byte)).join('');

  return composite;
};

export const passHash: CryptoPassHash = async (plaintext) => {
  const wc = await webcrypto();
  const salt = wc.getRandomValues(new Uint8Array(16));
  const passEncrypted = await passEncrypt(plaintext, salt);
  return passEncrypted as CryptoPassword;
};

export const passCompare: CryptoPassCompare = async (plaintext, hashtext) => {
  const salt = hashtext.slice(0, 16);
  const saltUint8 = new Uint8Array([...salt].map((char) => char.charCodeAt(0)));
  const currentPassHash = await passEncrypt(plaintext, saltUint8);
  return hashtext === currentPassHash;
};
