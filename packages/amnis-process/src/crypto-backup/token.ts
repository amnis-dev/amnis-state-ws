import type { JWTAccess, CryptoEncoded } from '@amnis/core';
import jwt from 'jsonwebtoken';
import { getRsaPrivateKey, getRsaPublicKey } from './rsa.js';

/**
 * Encodes an Amnis-structured Bearer.
 */
export function jwtEncode(
  jwtDecoded: JWTAccess,
  privateKey = getRsaPrivateKey(),
) {
  const jwtPrep = {
    ...jwtDecoded,
    exp: Math.floor(jwtDecoded.exp / 1000), // Seconds Since the Epoch
  };

  return jwt.sign(jwtPrep, privateKey, { algorithm: 'RS256' }) as CryptoEncoded;
}

export function jwtDecode(
  accessEncoded: CryptoEncoded,
) {
  try {
    const decoded = jwt.decode(accessEncoded);

    if (typeof decoded !== 'object') {
      return undefined;
    }

    if (
      decoded?.iss
      && decoded?.exp
      && decoded.iss === 'core'
      && typeof decoded.exp === 'number'
    ) {
      const jwtDecoded = {
        ...decoded,
        exp: decoded.exp * 1000,
      };
      return jwtDecoded;
    }

    return decoded;
  } catch (error) {
    return undefined;
  }
}

/**
 * Verifies an amnis bearer.
 */
export function jwtVerify(
  accessEncoded: CryptoEncoded,
  publicKey = getRsaPublicKey(),
): JWTAccess | undefined {
  try {
    const decoded = jwt.verify(accessEncoded, publicKey) as JWTAccess;

    const jwtDecoded = {
      ...decoded,
      exp: decoded.exp * 1000,
    } as JWTAccess;

    return jwtDecoded;
  } catch (error) {
    return undefined;
  }
}

export default { jwtEncode };
