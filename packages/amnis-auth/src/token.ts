import type { JWTDecoded, JWTEncoded } from '@amnis/core/token';
import jwt from 'jsonwebtoken';
import { cryptConfig } from './config';

export function jwtEncode(jwtDecoded: JWTDecoded, secret = cryptConfig.AUTH_TOKEN_SECRET) {
  if (secret.length < 21) {
    throw new Error('Secret not set or strong enough.');
  }

  const jwtPrep = {
    ...jwtDecoded,
    exp: Math.floor(jwtDecoded.exp / 1000), // Seconds Since the Epoch
  };

  return jwt.sign(jwtPrep, secret) as JWTEncoded;
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

export function jwtVerify(
  jwtEncoded: JWTEncoded,
  secret = cryptConfig.AUTH_TOKEN_SECRET,
): JWTDecoded | undefined {
  try {
    const decoded = jwt.verify(jwtEncoded, secret) as JWTDecoded;

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
