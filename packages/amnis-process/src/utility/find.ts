import {
  credentialKey,
  Entity,
  IoContext,
  UID,
  User,
  userKey,
  Credential,
} from '@amnis/core';

/**
 * Finds a user by Id.
 */
export const findUserByName = async (
  context: IoContext,
  name: string,
): Promise<Entity<User> | undefined> => {
  const results = await context.database.read({
    [userKey]: {
      $query: {
        name: {
          $eq: name,
        },
      },
    },
  }, {
    scope: { [userKey]: 'global' },
  });

  if (!results[userKey]?.length) {
    return undefined;
  }

  return results[userKey][0] as Entity<User>;
};

/**
 * Finds a credential by ID.
 */
export const findCredentialById = async (
  context: IoContext,
  id: UID<Credential>,
): Promise<Entity<Credential> | undefined> => {
  const results = await context.database.read({
    [credentialKey]: {
      $query: {
        $id: {
          $eq: id,
        },
      },
    },
  }, {
    scope: { [credentialKey]: 'global' },
  });

  if (!results[credentialKey]?.length) {
    return undefined;
  }

  return results[credentialKey][0] as Entity<Credential>;
};
