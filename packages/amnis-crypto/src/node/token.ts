/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CryptoTokenDecode } from '@amnis/core';
import jwt from 'jsonwebtoken';

export const tokenDecode: CryptoTokenDecode = async (encoded) => {
  const decoded = jwt.decode(encoded) as any;

  return decoded;
};

export default tokenDecode;
