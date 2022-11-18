import type { Crypto } from '@amnis/core';
import { randomString } from './random.js';
import { hashSha256 } from './hash.js';
import { symEncrypt, symDecrypt } from './sym.js';
import {
  asymDecrypt, asymEncrypt,
  asymGenerate, asymSingleton,
  asymVerify, asymSign,
} from './asym.js';
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
  asymEncrypt,
  asymDecrypt,
  asymSign,
  asymVerify,
  passHash,
  passCompare,
  sessionEncode,
  sessionVerify,
  accessEncode,
  accessVerify,
  tokenDecode,
};

export default cryptoNode;
