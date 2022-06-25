import { Role } from './auth.types';
import type { Reference, DateNumeric } from './core.types';

/**
 * Unique reference symbol for a token string.
 */
declare const tokenSymbol: unique symbol;
declare const jwtEncodedSymbol: unique symbol;

/**
 * String representation of a token that contains an encoded jwt.
 */
export type TokenString = string & {[tokenSymbol]: never};

/**
 * String representation of a jwt encoded token.
 */
export type JWTEncoded = string & {[jwtEncodedSymbol]: never};

/**
 * Token issuers
 * Core is used to identify self-owned tokens.
 */
export type TokenApi = 'core' | 'microsoft' | 'twitter';

/**
 * Token types.
 */
export type TokenType = 'access' | 'refresh';

/**
 * An interface for a token.
 */
export interface Token {
  /**
   * Name of the API
   * E.g. Twitter, MSGraph, Amnis, etc...
   */
  api: TokenApi;

  /**
   * Expiration date.
   */
  exp: DateNumeric;

  /**
   * Encoded value of the encoded jwt token.
   */
  jwt: JWTEncoded;

  /**
   * Type of token.
   */
  type: TokenType;
}

/**
  * A decoded access token for core apps.
  */
export interface JWTDecoded {
  /**
    * Issuer of the token.
    */
  iss: string;

  /**
    * Subject identifier.
    * (typically a user id)
    */
  sub: Reference;

  /**
    * Expiration numeric date.
    */
  exp: DateNumeric;

  /**
   * Issued-at numeric date.
   */
  iat?: DateNumeric;

  /**
   * Type of token.
   */
  typ: TokenType;

  /**
   * If this is considered an administrative token.
   */
  adm?: boolean;

  /**
   * Scope of permissions (role references).
   */
  roles: Reference<Role>[];
}
