import {
  CipherCCMTypes,
  BinaryLike,
  randomBytes,
  createCipheriv,
  createDecipheriv,
  CipherGCMTypes,
} from 'crypto';
import { AES256 } from './types';

// See https://csrc.nist.gov/publications/detail/sp/800-38d/final

const algorithm: CipherGCMTypes = 'aes-256-gcm';

/**
 * Encryption
 */
export function encrypt(text: string, key: string): AES256 {
  const iv: BinaryLike = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${(iv as Buffer).toString('hex')}:${encrypted.toString('hex')}` as AES256;
}

/**
 * Decryption
 */
export function decrypt(text: AES256, key: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedText = Buffer.from(textParts.slice(1).join(':'), 'hex');
  const decipher = createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
