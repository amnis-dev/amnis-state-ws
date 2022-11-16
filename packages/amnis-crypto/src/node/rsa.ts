import type {
  CryptoRSAGenerate, CryptoRSAKeyPair, CryptoRSAPrivateKey, CryptoRSAPublicKey,
} from '@amnis/core';
import {
  RSAKeyPairOptions, generateKeyPairSync, publicEncrypt, privateDecrypt, constants, sign, verify,
} from 'node:crypto';

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

/**
 * Encrypts data with RSA keys
 */
export const rsaEncrypt = async (
  data: string,
  publicKey?: CryptoRSAPublicKey,
): Promise<Buffer> => {
  const key = publicKey || (await rsaSingleton()).publicKey;
  const buffer = Buffer.from(data);
  return publicEncrypt({
    key,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  }, buffer);
};

/**
 * Decrypts data with RSA keys
 */
export const rsaDecrypt = async (
  encryption: Buffer,
  privateKey?: CryptoRSAPublicKey,
): Promise<string> => {
  const key = privateKey || (await rsaSingleton()).privateKey;
  return privateDecrypt({
    key,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  }, encryption).toString();
};

/**
 * Signs data with RSA keys
 */
export const rsaSign = async (
  data: string,
  privateKey?: CryptoRSAPublicKey,
): Promise<Buffer> => {
  const key = privateKey || (await rsaSingleton()).privateKey;
  const buffer = Buffer.from(data);
  return sign('sha256', buffer, {
    key,
    padding: constants.RSA_PKCS1_PSS_PADDING,
  });
};

/**
 * Signs data with RSA keys
 */
export const rsaVerify = async (
  data: string,
  signature: Buffer,
  privateKey?: CryptoRSAPublicKey,
): Promise<boolean> => {
  const key = privateKey || (await rsaSingleton()).privateKey;
  const buffer = Buffer.from(data);
  return verify('sha256', buffer, {
    key,
    padding: constants.RSA_PKCS1_PSS_PADDING,
  }, signature);
};
