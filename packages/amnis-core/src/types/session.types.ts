import type { Reference, DateNumeric } from './core.types';
import type { TokenString } from './token.types';

/**
 * A session object.
 * For stateless servers, it is recommended to store session data in secure HTTP cookies only.
 */
export interface Session {
  /**
   * Identifier
   */
  $id: Reference;

  /**
   * Subject of the session.
   * Typically a user id.
   */
  $subject: Reference;

  /**
   * Expiration date (numeric).
   */
  expires: DateNumeric;

  /**
   * Flag that determines if this is an administrative session.
   */
  admin: boolean;

  /**
   * Tokens this session possesses
   */
  tokens: TokenString[];

  /**
   * Display name.
   */
  displayName: string;

  /**
   * Organization.
   */
  orginization: string;

  /**
   * Avatar image url.
   */
  avatar: URL;
}
