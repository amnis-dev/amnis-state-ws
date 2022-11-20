/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JWTAccess,
  CryptoAccessEncode,
  CryptoAccessVerify,
  logCreator,
} from '@amnis/core';
import { tokenSign, tokenVerify } from './token.js';

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

  const token = await tokenSign(jwtPrep, privateKey);

  return token;
};

/**
 * Verifies an amnis bearer.
 */
export const accessVerify: CryptoAccessVerify = async (
  encoded,
  publicKey,
) => {
  const verified = await tokenVerify(encoded, publicKey);

  if (!verified) {
    return logCreator({
      level: 'error',
      title: 'Token Error',
      description: 'There was an issue verifying the access token',
    });
  }

  return verified;
};
