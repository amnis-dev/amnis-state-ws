import type { Reference, DateNumeric, SURL } from '../types';
import type { Entity } from '../entity';

/**
 * A session object.
 * For stateless servers, it is recommended to store session data in *SECURE* HTTP cookies only.
 */
export interface Session extends Entity {
  /**
   * Subject of the session.
   * Typically a user id.
   */
  $subject: Reference;

  /**
   * Possible "Issued At" property when decoding.
   */
  iat?: DateNumeric;

  /**
   * Expiration date (numeric).
   */
  exp: DateNumeric;

  /**
   * Flag that determines if this is an administrative session.
   */
  admin: boolean;

  /**
   * Display name.
   */
  name: string;

  /**
   * Avatar image url.
   */
  avatar: SURL | null;
}
