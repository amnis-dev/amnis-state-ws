import type { Crypto } from '@amnis/core';

export const cryptoBrowser: Crypto = {
  randomString: async (length = 126) => {
    throw new Error('Function not implemented.');
  },
  hashSha256: async (plain) => {
    throw new Error('Function not implemented.');
  },
  aesEncrypt: async () => {
    throw new Error('Function not implemented.');
  },
  aesDecrypt: async () => {
    throw new Error('Function not implemented.');
  },
  rsaGenerate: async () => {
    throw new Error('Function not implemented.');
  },
  rsaSingleton: async () => {
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