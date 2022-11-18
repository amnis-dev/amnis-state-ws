import { CryptoSym, CryptoSymDecrypt, CryptoSymEncrypt } from '@amnis/core';
import { randomString } from './random.js';

const algorithm = 'AES-GCM';

const symKeyEncode = async (
  key: string,
): Promise<CryptoKey> => window.crypto.subtle.importKey(
  'raw',
  Buffer.from(key),
  algorithm,
  false,
  ['encrypt', 'decrypt'],
);

let keyEncodedSingleton: CryptoKey | undefined;
const symKeySingleton = async (): Promise<CryptoKey> => {
  if (!keyEncodedSingleton) {
    keyEncodedSingleton = await symKeyEncode(await randomString());
  }
  return keyEncodedSingleton;
};

export const symEncrypt: CryptoSymEncrypt = async (plaintext, key) => {
  const dataEncoded = new TextEncoder().encode(plaintext);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const keyEncoded = key ? await symKeyEncode(key) : await symKeySingleton();

  const encryption = await window.crypto.subtle.encrypt(
    { name: algorithm, iv },
    keyEncoded,
    dataEncoded,
  );

  return `${Buffer.from(iv).toString('hex')}:${Buffer.from(encryption).toString('hex')}` as CryptoSym;
};

export const symDecrypt: CryptoSymDecrypt = async (encryption, key) => {
  const textParts = encryption.split(':');
  const iv = new Uint8Array(Buffer.from(textParts[0]));
  const encryptedText = new Uint8Array(Buffer.from(textParts.slice(1).join(':')));
  const keyEncoded = key ? await symKeyEncode(key) : await symKeySingleton();
  const decrypted = await window.crypto.subtle.decrypt(
    { name: algorithm, iv },
    keyEncoded,
    encryptedText,
  );

  return decrypted.toString();
};
