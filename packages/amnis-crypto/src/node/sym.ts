import {
  BinaryLike,
  randomBytes,
  createCipheriv,
  createDecipheriv,
  CipherGCMTypes,
} from 'node:crypto';
import { CryptoSym, CryptoSymDecrypt, CryptoSymEncrypt } from '@amnis/core';

const algorithm: CipherGCMTypes = 'aes-256-gcm';

export const symEncrypt: CryptoSymEncrypt = async (plaintext, key) => {
  const iv: BinaryLike = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plaintext);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${(iv as Buffer).toString('hex')}:${encrypted.toString('hex')}` as CryptoSym;
};

export const symDecrypt: CryptoSymDecrypt = async (encryption, key) => {
  const textParts = encryption.split(':');
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedText = Buffer.from(textParts.slice(1).join(':'), 'hex');
  const decipher = createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
