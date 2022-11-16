import { createHash, randomBytes } from 'node:crypto';
import type {
  Session, CryptoEncoded, CryptoSessionEncode, CryptoSessionVerify,
} from '@amnis/core';
import jwt from 'jsonwebtoken';

const sessionSecret = createHash('sha256').update(randomBytes(256)).digest('base64').slice(0, 256);

/**
 * Encode a session.
 */
export const sessionEncode: CryptoSessionEncode = async (
  session,
  secret = sessionSecret,
) => {
  const sessionPrep = {
    ...session,
    exp: Math.floor(session.exp / 1000),
  };
  const sessionToken = jwt.sign(sessionPrep, secret);
  return sessionToken as CryptoEncoded;
};

/**
 * Decode a session.
 */
export const sessionVerify: CryptoSessionVerify = async (
  sessionEncoded,
  secret = sessionSecret,
) => {
  try {
    const decoded = jwt.verify(sessionEncoded, secret, {}) as Session;

    const sessionDecoded = {
      ...decoded,
      exp: decoded.exp * 1000,
    } as Session;

    return sessionDecoded;
  } catch (error) {
    return undefined;
  }
};
