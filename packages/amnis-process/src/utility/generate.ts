import {
  Bearer,
  bearerCreate,
  dateNumeric,
  IoContext,
  JWTAccess,
  Role,
  Session,
  sessionCreator,
  System,
  UID,
  uidList,
  UIDList,
} from '@amnis/core';

/**
 * Generates a session.
 */
export const generateSession = async (
  system: System,
  subjectId: UID,
  displayName: string,
  $roles: UIDList<Role> = uidList(),
): Promise<Session> => {
  /**
   * Create the session expiration.
   */
  const sessionExpires = dateNumeric(`${system.sessionExpires}m`);

  /**
   * Create the new user session.
   */
  const session = sessionCreator({
    $subject: subjectId,
    exp: sessionExpires,
    name: displayName,
    adm: $roles.includes(system.$adminRole),
    exc: $roles.includes(system.$execRole),
  });

  return session;
};

/**
 * Create an access bearer token.
 */
export const generateBearer = async (
  context: IoContext,
  system: System,
  subjectId: UID,
  roles: UIDList<Role>,
): Promise<Bearer> => {
  /**
   * Create the bearer token expiration.
   */
  const bearerExpires = dateNumeric(`${system.bearerExpires}m`);

  /**
   * Create the JWT data.
   */
  const jwtAccess: JWTAccess = {
    iss: '',
    sub: subjectId,
    exp: bearerExpires,
    typ: 'access',
    roles,
  };

  /**
 * Create the bearer container.
 * This is so we have ensured data about our JWT.
 */
  const bearerAccess = bearerCreate({
    id: 'core',
    exp: bearerExpires,
    access: await context.crypto.accessEncode(jwtAccess),
  });

  return bearerAccess;
};
