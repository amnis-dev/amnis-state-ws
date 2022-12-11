import type { UID, DateNumeric } from '../../types.js';
import type { EntityCreator } from '../entity.types.js';

/**
 * A session object.
 * Session data should be stored in *SECURE* HTTP cookies only.
 */
export interface Session extends EntityCreator {
  /**
   * Subject of the session.
   * Typically a user id.
   */
  $subject: UID;

  /**
   * Possible "Issued At" property when decoding.
   */
  iat?: DateNumeric;

  /**
   * Expiration date (numeric).
   */
  exp: DateNumeric;

  /**
   * If the session holder is an administrator.
   */
  adm: boolean;

  /**
   * If the session holder is an executive.
   */
  exc: boolean;

  /**
   * Display name.
   */
  name: string;
}
