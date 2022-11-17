import type {
  CryptoAsymGenerate, CryptoAsymKeyPair, CryptoAsymPrivateKey, CryptoAsymPublicKey,
} from '@amnis/core';
import {
  RSAKeyPairOptions, generateKeyPairSync, publicEncrypt, privateDecrypt, constants, sign, verify,
} from 'node:crypto';

/**
 * Singleton RSA instance.
 */
let asymKeyPair: CryptoAsymKeyPair | null = null;

/**
 * Configurations
 */
const asymConfig = {
  modulusLength: 4096,
  publicKeyType: 'spki',
  privateKeyType: 'pkcs8',
};

/**
 * Generate a new RSA Key Pair
 */
export const asymGenerate: CryptoAsymGenerate = async () => {
  const asymOptions: RSAKeyPairOptions<'pem', 'pem'> = {
    modulusLength: asymConfig.modulusLength,
    publicKeyEncoding: {
      type: asymConfig.publicKeyType as 'spki' | 'pkcs1' || 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: asymConfig.privateKeyType as 'pkcs1' | 'pkcs8' || 'pkcs8',
      format: 'pem',
    },
  };

  const keyPairGen = generateKeyPairSync('rsa', asymOptions);

  return {
    privateKey: keyPairGen.privateKey as CryptoAsymPrivateKey,
    publicKey: keyPairGen.publicKey as CryptoAsymPublicKey,
  };
};

/**
 * Gets the singlton an RSA Key Pair.
 */
export const asymSingleton: CryptoAsymGenerate = async () => {
  if (asymKeyPair === null) {
    asymKeyPair = await asymGenerate();
  }

  return asymKeyPair;
};

/**
 * Encrypts data with RSA keys
 */
export const asymEncrypt = async (
  data: string,
  publicKey?: CryptoAsymPublicKey,
): Promise<Buffer> => {
  const key = publicKey || (await asymSingleton()).publicKey;
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
export const asymDecrypt = async (
  encryption: Buffer,
  privateKey?: CryptoAsymPublicKey,
): Promise<string> => {
  const key = privateKey || (await asymSingleton()).privateKey;
  return privateDecrypt({
    key,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  }, encryption).toString();
};

/**
 * Signs data with RSA keys
 */
export const asymSign = async (
  data: string,
  privateKey?: CryptoAsymPublicKey,
): Promise<Buffer> => {
  const key = privateKey || (await asymSingleton()).privateKey;
  const buffer = Buffer.from(data);
  return sign('sha256', buffer, {
    key,
    padding: constants.RSA_PKCS1_PSS_PADDING,
  });
};

/**
 * Signs data with RSA keys
 */
export const asymVerify = async (
  data: string,
  signature: Buffer,
  privateKey?: CryptoAsymPublicKey,
): Promise<boolean> => {
  const key = privateKey || (await asymSingleton()).privateKey;
  const buffer = Buffer.from(data);
  return verify('sha256', buffer, {
    key,
    padding: constants.RSA_PKCS1_PSS_PADDING,
  }, signature);
};
