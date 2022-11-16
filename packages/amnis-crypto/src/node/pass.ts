import { CryptoPassCompare, CryptoPassHash, CryptoPassword } from '@amnis/core';
import { scryptSync, randomBytes } from 'node:crypto';

const passEncrypt = (password: string, salt: string) => scryptSync(password, salt, 32).toString('hex');

export const passHash: CryptoPassHash = async (plaintext) => {
  const salt = randomBytes(16).toString('hex');
  return (passEncrypt(plaintext, salt) + salt) as CryptoPassword;
};

export const passCompare: CryptoPassCompare = async (plaintext, hashtext) => {
  const salt = hashtext.slice(64);
  const originalPassHash = hashtext.slice(0, 64);
  const currentPassHash = passEncrypt(plaintext, salt);
  return originalPassHash === currentPassHash;
};
