import { CryptoHashSHA256 } from '@amnis/core';
import { createHash } from 'node:crypto';

/**
 * Encrypt with SHA-256.
 */
export const hashSha256: CryptoHashSHA256 = async (plaintext) => createHash('sha256').update(plaintext).digest('base64url');

export default hashSha256;
