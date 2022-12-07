import {
  Bearer,
  bearerCreate,
  dateNumeric,
  IoContext,
  JWTAccess,
  Profile,
  Session,
  sessionCreator,
  System,
  User,
} from '@amnis/core';

/**
 * Generates a session.
 */
export const generateSession = async (
  system: System,
  user: User,
  profile: Profile,
): Promise<Session> => {
  /**
   * Create the session expiration.
   */
  const sessionExpires = dateNumeric(`${system.sessionExpires}`);

  /**
   * Create the new user session.
   */
  const session = sessionCreator({
    $subject: user.$id,
    exp: sessionExpires,
    admin: false,
    name: profile.nameDisplay,
    avatar: profile.avatar || null,
  });

  return session;
};

/**
 * Create an access bearer token.
 */
export const generateBearer = async (
  context: IoContext,
  system: System,
  user: User,
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
    sub: user.$id,
    exp: bearerExpires,
    typ: 'access',
    roles: user.$roles,
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
