import type {
  CryptoAsymEncryption,
  CryptoAsymEncrypt,
  CryptoAsymGenerate,
  CryptoAsymKeyPair,
  CryptoAsymPrivateKey,
  CryptoAsymPublicKey,
  CryptoAsymDecrypt,
  CryptoAsymSign,
  CryptoAsymSignature,
  CryptoAsymVerify,
} from '@amnis/core';
import { webcrypto } from '../webcrypto.js';

/**
 * Singleton RSA instances.
 */
let asymKeyPairEncryptor: CryptoAsymKeyPair | undefined;
let asymKeyPairSigner: CryptoAsymKeyPair | undefined;

/**
 * Generate a new RSA Key Pair
 */
export const asymGenerate: CryptoAsymGenerate = async (type) => {
  const wc = await webcrypto();
  const keyPairGen = await wc.subtle.generateKey(
    {
      name: type === 'encryptor' ? 'RSA-OAEP' : 'RSASSA-PKCS1-v1_5',
      modulusLength: type === 'encryptor' ? 4096 : 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256',
    },
    true,
    type === 'encryptor' ? ['encrypt', 'decrypt'] : ['sign', 'verify'],
  );

  return {
    privateKey: keyPairGen.privateKey as CryptoAsymPrivateKey,
    publicKey: keyPairGen.publicKey as CryptoAsymPublicKey,
  };
};

/**
 * Gets the singlton an RSA Key Pair.
 */
export const asymSingleton: CryptoAsymGenerate = async (type) => {
  if (!asymKeyPairEncryptor) {
    asymKeyPairEncryptor = await asymGenerate('encryptor');
  }
  if (!asymKeyPairSigner) {
    asymKeyPairSigner = await asymGenerate('signer');
  }

  if (type === 'encryptor') {
    return asymKeyPairEncryptor;
  }

  return asymKeyPairSigner;
};

/**
 * Encrypts data with RSA keys
 */
export const asymEncrypt: CryptoAsymEncrypt = async (
  data,
  publicKey,
) => {
  const wc = await webcrypto();
  const key = publicKey || (await asymSingleton('encryptor')).publicKey;
  const unit8 = new TextEncoder().encode(data);
  const encryption = await wc.subtle.encrypt(
    { name: 'RSA-OAEP' },
    key,
    unit8,
  );
  return encryption as CryptoAsymEncryption;
};

/**
 * Decrypts data with RSA keys
 */
export const asymDecrypt: CryptoAsymDecrypt = async (
  encryption,
  privateKey,
) => {
  const wc = await webcrypto();
  const key = privateKey || (await asymSingleton('encryptor')).privateKey;
  try {
    const decrypt = await wc.subtle.decrypt(
      { name: 'RSA-OAEP' },
      key,
      encryption,
    );
    return new TextDecoder().decode(decrypt);
  } catch (error) {
    return undefined;
  }
};

/**
 * Signs data with RSA keys
 */
export const asymSign: CryptoAsymSign = async (
  data,
  privateKey,
) => {
  const wc = await webcrypto();
  const key = privateKey || (await asymSingleton('signer')).privateKey;
  const uint8 = new TextEncoder().encode(data);
  const signature = await wc.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    uint8,
  ) as CryptoAsymSignature;
  return signature;
};

/**
 * Verifies data with RSA keys
 */
export const asymVerify: CryptoAsymVerify = async (
  data,
  signature,
  publicKey,
) => {
  const wc = await webcrypto();
  const key = publicKey || (await asymSingleton('signer')).publicKey;
  const unit8 = new TextEncoder().encode(data);
  try {
    const result = await wc.subtle.verify(
      { name: 'RSASSA-PKCS1-v1_5' },
      key,
      signature,
      unit8,
    );
    return result;
  } catch (error) {
    return false;
  }
};