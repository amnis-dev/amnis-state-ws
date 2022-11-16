import type {
  JWTAccess, CryptoEncoded, CryptoAccessEncode, CryptoAccessVerify,
} from '@amnis/core';
import jwt from 'jsonwebtoken';
import { rsaSingleton } from './rsa.js';

/**
 * Encodes an Amnis-structured Bearer.
 */
export const accessEncode: CryptoAccessEncode = async (
  access: JWTAccess,
  privateKey,
) => {
  const jwtPrep = {
    ...access,
    exp: Math.floor(access.exp / 1000), // Seconds Since the Epoch
  };

  if (privateKey) {
    return jwt.sign(jwtPrep, privateKey, { algorithm: 'RS256' }) as CryptoEncoded;
  }
  const rsaKeyPair = await rsaSingleton();
  return jwt.sign(jwtPrep, rsaKeyPair.privateKey, { algorithm: 'RS256' }) as CryptoEncoded;
};

/**
 * Verifies an amnis bearer.
 */
export const accessVerify: CryptoAccessVerify = async (
  encoded,
  publicKey,
) => {
  try {
    let decoded: JWTAccess | undefined;

    if (publicKey) {
      decoded = jwt.verify(encoded, publicKey) as JWTAccess;
    } else {
      const rsaKeyPair = await rsaSingleton();
      decoded = jwt.verify(encoded, rsaKeyPair.publicKey) as JWTAccess;
    }

    const jwtDecoded = {
      ...decoded,
      exp: decoded.exp * 1000,
    } as JWTAccess;

    return jwtDecoded;
  } catch (error) {
    return undefined;
  }
};
