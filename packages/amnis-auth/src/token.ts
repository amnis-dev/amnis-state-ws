import type { JWTDecoded, JWTEncoded } from '@amnis/core/token';
import jwt from 'jsonwebtoken';
import { AUTH_TOKEN_SECRET } from './const';

export function jwtEncode(jwtDecoded: JWTDecoded, secret = AUTH_TOKEN_SECRET) {
  if (secret.length < 21) {
    throw new Error('Secret not set or strong enough.');
  }

  return jwt.sign(jwtDecoded, secret) as JWTEncoded;
}

export function jwtDecode(jwtEncoded: JWTEncoded) {
  return jwt.decode(jwtEncoded);
}

export function jwtVerify(
  jwtEncoded: JWTEncoded,
  secret = AUTH_TOKEN_SECRET,
): JWTDecoded | undefined {
  try {
    const decoded = jwt.verify(jwtEncoded, secret) as JWTDecoded;

    return decoded;
  } catch (error) {
    return undefined;
  }
}

export default { jwtEncode };
