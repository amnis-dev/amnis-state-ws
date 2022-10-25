import type { JWTDecoded, JWTEncoded } from '@amnis/core';
import jwt from 'jsonwebtoken';
import { getRsaPrivateKey, getRsaPublicKey } from './rsa.js';

/**
 * Encodes an Amnis-structured Token.
 */
export function jwtEncode(
  jwtDecoded: JWTDecoded,
  privateKey = getRsaPrivateKey(),
) {
  const jwtPrep = {
    ...jwtDecoded,
    exp: Math.floor(jwtDecoded.exp / 1000), // Seconds Since the Epoch
  };

  return jwt.sign(jwtPrep, privateKey, { algorithm: 'RS256' }) as JWTEncoded;
}

export function jwtDecode(
  jwtEncoded: JWTEncoded,
) {
  try {
    const decoded = jwt.decode(jwtEncoded);

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
 * Verifies an amnis token.
 */
export function jwtVerify(
  jwtEncoded: JWTEncoded,
  publicKey = getRsaPublicKey(),
): JWTDecoded | undefined {
  try {
    const decoded = jwt.verify(jwtEncoded, publicKey) as JWTDecoded;

    const jwtDecoded = {
      ...decoded,
      exp: decoded.exp * 1000,
    } as JWTDecoded;

    return jwtDecoded;
  } catch (error) {
    return undefined;
  }
}

export default { jwtEncode };
