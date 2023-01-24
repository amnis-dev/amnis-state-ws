import type { Role } from './entity/index.js';
import type { DateNumeric, UID } from './types.js';

/**
 * A decoded JWT Access token for core amnis applications.
 */
export interface JWTAccess {
  /**
    * Issuer of the access token.
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
   * Marks an administrative bearer.
   */
  adm?: boolean;

  /**
   * Marks an executive bearer.
   */
  exc?: boolean;

  /**
   * Permissions reference.
   */
  pem?: string;

  /**
   * Scope of permissions (role references).
   */
  roles: UID<Role>[];
}
