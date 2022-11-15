import { scryptSync, randomBytes } from 'node:crypto';

const passEncrypt = (password: string, salt: string) => scryptSync(password, salt, 32).toString('hex');

export function passCreate(plaintext: string): string {
  const salt = randomBytes(16).toString('hex');
  return passEncrypt(plaintext, salt) + salt;
}

export function passCompare(plaintext: string, hashtext: string): boolean {
  const salt = hashtext.slice(64);
  const originalPassHash = hashtext.slice(0, 64);
  const currentPassHash = passEncrypt(plaintext, salt);
  return originalPassHash === currentPassHash;
}
