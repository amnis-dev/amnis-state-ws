import type { Role } from './entity/index.js';
import type { DateNumeric, UID } from './types.js';

/**
 * A decoded JWT Access token for core amnis applications.
 */
export interface JWTAccess {
  /**
    * Issuer of the bearer.
    */
  iss: string;

  /**
    * Subject identifier.
    * (typically a user id)
    */
  sub: UID;

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
  typ: 'access' | 'refresh';

  /**
   * If this is considered an administrative bearer.
   */
  adm?: boolean;

  /**
   * Scope of permissions (role references).
   */
  roles: UID<Role>[];
}
