import type { Crypto } from '@amnis/core';
import { randomString } from './random.js';
import { hashSha256 } from './hash.js';
import { symEncrypt, symDecrypt } from './sym.js';
import { asymGenerate, asymSingleton } from './asym.js';
import { passCompare, passHash } from './pass.js';
import { sessionEncode, sessionVerify } from './session.js';
import { accessEncode, accessVerify } from './access.js';
import { tokenDecode } from './token.js';

export const cryptoNode: Crypto = {
  randomString,
  hashSha256,
  symEncrypt,
  symDecrypt,
  asymGenerate,
  asymSingleton,
  passHash,
  passCompare,
  sessionEncode,
  sessionVerify,
  accessEncode,
  accessVerify,
  tokenDecode,
};

export default cryptoNode;
