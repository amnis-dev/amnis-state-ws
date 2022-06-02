import type { TokenDecoded, TokenEncoded } from '@amnis/core/types';
import jwt from 'jsonwebtoken';

export function tokenEncode(tokenDecoded: TokenDecoded, secret: string) {
  return jwt.sign(tokenDecoded, secret) as TokenEncoded;
}

export function tokenDecode(tokenEncoded: TokenEncoded) {
  return jwt.decode(tokenEncoded);
}

export function tokenVerify(tokenEncoded: TokenEncoded, secret: string): TokenDecoded | undefined {
  try {
    const decoded = jwt.verify(tokenEncoded, secret) as TokenDecoded;

    return decoded;
  } catch (error) {
    return undefined;
  }
}

export default { tokenEncode };
