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
  Credential,
  roleComboCreate,
  Entity,
  entityCreate,
  userCreator,
} from '@amnis/core';
import { roleActions, roleSelectors } from '@amnis/state';

/**
 * Generates a session.
 */
export const generateSession = async (
  system: System,
  $subject: UID,
  $credential: UID<Credential>,
  $roles: UIDList<Role> = uidList(),
): Promise<Session> => {
  /**
   * Create the session expiration.
   */
  const sessionExpires = dateNumeric(`${system.sessionExpires}m`);

  const admIs = $roles.includes(system.$adminRole);
  const excIs = $roles.includes(system.$execRole);

  /**
   * Create the new user session.
   */
  const session = sessionCreator({
    $subject,
    $credential,
    exp: sessionExpires,
    adm: admIs,
    exc: excIs,
    prv: admIs || excIs,
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
  $roles: UIDList<Role>,
): Promise<Bearer> => {
  const { store, crypto } = context;
  /**
   * Create the bearer token expiration.
   */
  const bearerExpires = dateNumeric(`${system.bearerExpires}m`);

  /**
   * Cache a combined grant list from the roles.
   */
  const roles = $roles.map(($role) => (
    roleSelectors.selectById(store.getState(), $role)
  )).filter((role) => !!role) as Entity<Role>[];
  const combo = roleComboCreate(roles);
  store.dispatch(roleActions.insertCombo(combo));

  /**
   * Create the JWT data.
   */
  const jwtAccess: JWTAccess = {
    iss: '',
    sub: subjectId,
    exp: bearerExpires,
    typ: 'access',
    pem: combo[0],
  };

  /**
 * Create the bearer container.
 * This is so we have ensured data about our JWT.
 */
  const bearerAccess = bearerCreate({
    id: 'core',
    exp: bearerExpires,
    access: await crypto.accessEncode(jwtAccess),
  });

  return bearerAccess;
};

/**
 * Generate an anonymous user.
 */
export const generateUserAnonymous = (system: System) => {
  const { $anonymousRole } = system;
  return entityCreate(userCreator({
    handle: 'anonymous',
    $roles: $anonymousRole ? [$anonymousRole] : [],
  }));
};
