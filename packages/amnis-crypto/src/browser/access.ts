/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JWTAccess, CryptoEncoded, CryptoAccessEncode, CryptoAccessVerify, logCreator,
} from '@amnis/core';
import jwt from 'jsonwebtoken';
import { asymSingleton } from './asym.js';

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

  const pk = privateKey || (await asymSingleton()).privateKey;
  return jwt.sign(jwtPrep, pk, { algorithm: 'RS256' }) as CryptoEncoded;
};

/**
 * Verifies an amnis bearer.
 */
export const accessVerify: CryptoAccessVerify = async (
  encoded,
  publicKey,
) => {
  try {
    const pk = publicKey || (await asymSingleton()).publicKey;
    const decoded = jwt.verify(encoded, pk) as JWTAccess;

    const jwtDecoded = {
      ...decoded,
      exp: decoded.exp * 1000,
    } as JWTAccess;

    return jwtDecoded;
  } catch (error: any) {
    return logCreator({
      level: 'error',
      title: `${error?.name || 'Token Error'}`,
      description: `${error?.message || 'There was an issue verifying the access token'}`,
    });
  }
};
