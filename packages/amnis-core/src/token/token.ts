/* eslint-disable no-bitwise */
import type { DateNumeric } from '../types';
import type {
  TokenString,
  Token,
  TokenApi,
  TokenType,
  JWTEncoded,
} from './token.types';
/**
 * Converts a token to string format.
 */
export function tokenStringify(token: Token): TokenString {
  return `${token.api}:${token.type}:${token.exp}:${token.jwt}` as TokenString;
}

/**
 * Converts a token string to a token object.
 */
export function tokenParse(tokenString: TokenString): Token | undefined {
  const [api, type, exp, encoding] = tokenString.split(':');

  if (typeof api !== 'string') {
    return undefined;
  }

  if (typeof type !== 'string') {
    return undefined;
  }

  if (!['access', 'refresh'].includes(type)) {
    return undefined;
  }

  if (typeof encoding !== 'string') {
    return undefined;
  }

  return {
    api: api as TokenApi,
    type: type as TokenType,
    jwt: encoding as JWTEncoded,
    exp: parseInt(exp, 10) as DateNumeric,
  };
}
