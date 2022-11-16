import type {
  CryptoRSAGenerate, CryptoRSAKeyPair, CryptoRSAPrivateKey, CryptoRSAPublicKey,
} from '@amnis/core';
import { RSAKeyPairOptions, generateKeyPairSync } from 'node:crypto';

/**
 * Singleton RSA instance.
 */
let rsaKeyPair: CryptoRSAKeyPair | null = null;

/**
 * Configurations
 */
const rsaConfig = {
  modulusLength: 4096,
  publicKeyType: 'spki',
  privateKeyType: 'pkcs8',
};

/**
 * Generate a new RSA Key Pair
 */
export const rsaGenerate: CryptoRSAGenerate = async () => {
  const rsaOptions: RSAKeyPairOptions<'pem', 'pem'> = {
    modulusLength: rsaConfig.modulusLength,
    publicKeyEncoding: {
      type: rsaConfig.publicKeyType as 'spki' | 'pkcs1' || 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: rsaConfig.privateKeyType as 'pkcs1' | 'pkcs8' || 'pkcs8',
      format: 'pem',
    },
  };

  const keyPairGen = generateKeyPairSync('rsa', rsaOptions);

  return {
    privateKey: keyPairGen.privateKey as CryptoRSAPrivateKey,
    publicKey: keyPairGen.publicKey as CryptoRSAPublicKey,
  };
};

/**
 * Gets the singlton an RSA Key Pair.
 */
export const rsaSingleton: CryptoRSAGenerate = async () => {
  if (rsaKeyPair === null) {
    rsaKeyPair = await rsaGenerate();
  }

  return rsaKeyPair;
};
