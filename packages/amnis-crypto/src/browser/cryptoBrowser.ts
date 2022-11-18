import type {
  Crypto,
  CryptoAsymEncryption,
  CryptoAsymPrivateKey,
  CryptoAsymPublicKey,
  CryptoAsymSignature,
} from '@amnis/core';

export const cryptoBrowser: Crypto = {
  randomString: async (length = 126) => {
    throw new Error('Function not implemented.');
  },
  hashSha256: async (plain) => {
    throw new Error('Function not implemented.');
  },
  symEncrypt: async () => {
    throw new Error('Function not implemented.');
  },
  symDecrypt: async () => {
    throw new Error('Function not implemented.');
  },
  asymGenerate: async () => {
    throw new Error('Function not implemented.');
  },
  asymSingleton: async () => {
    throw new Error('Function not implemented.');
  },
  asymEncrypt(
    data: string,
    publicKey?: CryptoAsymPublicKey,
  ): Promise<CryptoAsymEncryption> {
    throw new Error('Function not implemented.');
  },
  asymDecrypt(
    encryption: CryptoAsymEncryption,
    privateKey?: CryptoAsymPrivateKey,
  ): Promise<string> {
    throw new Error('Function not implemented.');
  },
  asymSign(
    data: string,
    privateKey?: CryptoAsymPrivateKey,
  ): Promise<CryptoAsymSignature> {
    throw new Error('Function not implemented.');
  },
  asymVerify(
    data: string,
    signature: CryptoAsymSignature,
    publicKey?: CryptoAsymPublicKey,
  ): Promise<boolean> {
    throw new Error('Function not implemented.');
  },
  passHash: async (plaintext) => {
    throw new Error('Function not implemented.');
  },
  passCompare: (plaintext, hashtext) => {
    throw new Error('Function not implemented.');
  },
  sessionEncode: async (session, secret) => {
    throw new Error('Function not implemented.');
  },
  sessionVerify: async (encoded, secret) => {
    throw new Error('Function not implemented.');
  },
  accessEncode: async (access, secret) => {
    throw new Error('Function not implemented.');
  },
  accessVerify: async (encoded, secret) => {
    throw new Error('Function not implemented.');
  },
  tokenDecode: async (encoded) => {
    throw new Error('Function not implemented.');
  },
};

export default cryptoBrowser;
