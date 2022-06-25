/* eslint-disable no-bitwise */
/* eslint-disable no-unused-expressions */
import { nanoid } from '@reduxjs/toolkit';
import {
  DateJSON,
  DateNumeric,
  SURL,
  Reference,
  TokenString,
  Token,
  TokenApi,
  TokenType,
  JWTEncoded,
  SliceKey,
} from './types';

/**
 * Function for no operation.
 */
export const noop = () => { /** No operation. */ };

/**
 * Create a reference to another type.
 */
export const reference = <T>(key: string, id = nanoid()) => `${key}:${id}` as Reference<T>;

/**
 * Create a slice key.
 */
export const sliceKey = (key: string) => key as SliceKey;

/**
 * Creates a string URL (aka SURL).
 */
export const surl = (path: string) => (path as SURL);

/**
 * Creates a Date JSON string type.
 */
export const dateJSON = (date?: Date) => (
  (date?.toJSON() ?? new Date().toJSON()) as DateJSON
);

/**
 * Create a numeric date value. Needed typically for tokens.
 */
export const dateNumeric = (date?: Date | string): DateNumeric => {
  if (typeof date === 'string') {
    const unit = date.slice(-1);
    const value = parseInt(date, 10);
    if (Number.isNaN(value)) {
      return new Date().getTime() as DateNumeric;
    }
    switch (unit) {
      case 's':
        return new Date(Date.now() + value * 1000).getTime() as DateNumeric;
      case 'm':
        return new Date(Date.now() + value * 60000).getTime() as DateNumeric;
      case 'h':
        return new Date(Date.now() + value * 3600000).getTime() as DateNumeric;
      case 'd':
        return new Date(Date.now() + value * 86400000).getTime() as DateNumeric;
      default:
        return new Date().getTime() as DateNumeric;
    }
  }
  return (date?.getTime() ?? new Date().getTime()) as DateNumeric;
};

/**
 * Validates a reference type.
 */
export const referenceValidate = (ref: string): boolean => {
  const [key, id] = ref.split(':');

  if (!key || typeof key !== 'string') {
    return false;
  }

  if (!id || typeof id !== 'string' || id.length < 1) {
    return false;
  }

  return true;
};

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
