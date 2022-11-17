import type {
  CryptoAsymEncryption,
  CryptoAsymEncrypt,
  CryptoAsymGenerate, CryptoAsymKeyPair, CryptoAsymPrivateKey, CryptoAsymPublicKey, CryptoAsymDecrypt, CryptoAsymSign, CryptoAsymSignature, CryptoAsymVerify,
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
export const asymEncrypt: CryptoAsymEncrypt = async (
  data,
  publicKey,
) => {
  const key = publicKey || (await asymSingleton()).publicKey;
  const buffer = Buffer.from(data);
  return publicEncrypt({
    key,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  }, buffer) as CryptoAsymEncryption;
};

/**
 * Decrypts data with RSA keys
 */
export const asymDecrypt: CryptoAsymDecrypt = async (
  encryption,
  privateKey,
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
export const asymSign: CryptoAsymSign = async (
  data,
  privateKey,
) => {
  const key = privateKey || (await asymSingleton()).privateKey;
  const buffer = Buffer.from(data);
  return sign('sha256', buffer, {
    key,
    padding: constants.RSA_PKCS1_PSS_PADDING,
  }) as CryptoAsymSignature;
};

/**
 * Verifies data with RSA keys
 */
export const asymVerify: CryptoAsymVerify = async (
  data,
  signature,
  privateKey,
) => {
  const key = privateKey || (await asymSingleton()).privateKey;
  const buffer = Buffer.from(data);
  return verify('sha256', buffer, {
    key,
    padding: constants.RSA_PKCS1_PSS_PADDING,
  }, signature);
};
