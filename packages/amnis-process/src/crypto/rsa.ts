import { RSAKeyPairOptions, generateKeyPairSync, KeyPairSyncResult } from 'node:crypto';
import { processConfig } from '../config.js';

/**
 * RSA Key Pair
 */
let rsaKeyPair: KeyPairSyncResult<string, string> | null = null;

/**
 * Generate a new RSA Key Pair
 */
export function generateRsa(): KeyPairSyncResult<string, string> {
  const rsaOptions: RSAKeyPairOptions<'pem', 'pem'> = {
    modulusLength: processConfig.PROCESS_RSA_MODULUS_LENGTH as number || 4096,
    publicKeyEncoding: {
      type: processConfig.PROCESS_RSA_PUBLIC_KEY_TYPE as 'spki' | 'pkcs1' || 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: processConfig.PROCESS_RSA_PRIVATE_KEY_TYPE as 'pkcs1' | 'pkcs8' || 'pkcs8',
      format: 'pem',
    },
  };

  return generateKeyPairSync('rsa', rsaOptions);
}

/**
 * Gets the singlton an RSA Key Pair.
 */
export function getRsaKeyPair(): KeyPairSyncResult<string, string> {
  if (rsaKeyPair === null) {
    rsaKeyPair = generateRsa();
  }

  return rsaKeyPair;
}

/**
 * Get the RSA Private Key
 */
export function getRsaPrivateKey(): KeyPairSyncResult<string, string>['privateKey'] {
  return getRsaKeyPair().privateKey;
}

/**
 * Get the RSA Public Key
 */
export function getRsaPublicKey(): KeyPairSyncResult<string, string>['publicKey'] {
  return getRsaKeyPair().publicKey;
}
