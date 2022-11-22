import { CryptoHash, CryptoHashData } from '@amnis/core';
import { hashEncode } from '../utility.js';
import { webcrypto } from '../webcrypto.js';

/**
 * Hash data with SHA-256.
 */
export const hashData: CryptoHashData = async (data) => {
  const wc = await webcrypto();
  const encoded = new TextEncoder().encode(data);
  const hash = await wc.subtle.digest('SHA-256', encoded);
  const hashUint8 = new Uint8Array(hash);
  const hashB64 = hashEncode(hashUint8);
  return hashB64 as CryptoHash;
};

export default hashData;
