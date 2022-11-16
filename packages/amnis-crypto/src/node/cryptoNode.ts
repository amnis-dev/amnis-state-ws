import type { Crypto } from '@amnis/core';
import { randomString } from './random.js';
import { hashSha256 } from './hash.js';
import { aesEncrypt, aesDecrypt } from './aes.js';
import { rsaGenerate, rsaSingleton } from './rsa.js';
import { passCompare, passHash } from './pass.js';
import { sessionEncode, sessionVerify } from './session.js';
import { accessEncode, accessVerify } from './access.js';
import { tokenDecode } from './token.js';

export const cryptoNode: Crypto = {
  randomString,
  hashSha256,
  aesEncrypt,
  aesDecrypt,
  rsaGenerate,
  rsaSingleton,
  passHash,
  passCompare,
  sessionEncode,
  sessionVerify,
  accessEncode,
  accessVerify,
  tokenDecode,
};

export default cryptoNode;
