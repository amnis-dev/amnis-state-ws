/* eslint-disable no-bitwise */
import {
  Entity,
} from '../entity';
import type { DateNumeric } from '../types';
import type {
  TokenString,
  Token,
  TokenApi,
  TokenType,
  JWTEncoded,
  JWTDecoded,
} from './token.types';
import type { Log } from '../log';

export const tokenKey = 'token';

export function tokenCreate(
  token: Omit<Token, 'id'>,
): Token {
  const tokenNew: Token = {
    id: `${token.api}:${token.type}`,
    ...token,
  };

  return tokenNew;
}

/**
 * Converts a token to string format.
 */
export function tokenStringify(token: Omit<Token, 'id'>): TokenString {
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
    id: `${api}:${type}`,
    api: api as TokenApi,
    type: type as TokenType,
    jwt: encoding as JWTEncoded,
    exp: parseInt(exp, 10) as DateNumeric,
  };
}

/**
 * A wrapper that modifies an entity creation within the token of a token.
 * Essentially, sets the $creator and $owner based on the token subject (sub).
 */
export function tokenJwtContext<E extends Entity>(
  createResult: [E, Log[]],
  token: JWTDecoded,
): [E, Log[]] {
  const [entity, logs] = createResult;

  const newEntity: E = {
    ...entity,
    $creator: token.sub,
    $owner: token.sub,
  };

  return [newEntity, logs];
}
