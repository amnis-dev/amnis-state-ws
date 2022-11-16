import type { CryptoRandomString } from '@amnis/core';
import { randomBytes } from 'node:crypto';
/**
 * Generate a random verifier string.
 */
export const randomString: CryptoRandomString = async (length = 128) => randomBytes(length).toString('hex');

export default randomString;
