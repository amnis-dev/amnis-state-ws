import type { Crypto } from '@amnis/core';
import { randomString } from './random.js';
import { hashData } from './hash.js';
import { symGenerate, symEncrypt, symDecrypt } from './sym.js';
import {
  asymDecrypt, asymEncrypt,
  asymGenerate, asymSingleton,
  asymVerify, asymSign,
} from './asym.js';
import { passCompare, passHash } from './pass.js';
import { sessionEncrypt, sessionDecrypt } from './session.js';
import { accessEncode, accessVerify } from './access.js';
import { tokenDecode } from './token.js';

export const cryptoWeb: Crypto = {
  randomString,
  hashData,
  symGenerate,
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
  sessionEncrypt,
  sessionDecrypt,
  accessEncode,
  accessVerify,
  tokenDecode,
};

export default cryptoWeb;
