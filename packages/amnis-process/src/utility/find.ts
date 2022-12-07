import {
  credentialKey,
  Entity,
  IoContext,
  UID,
  User,
  userKey,
  Credential,
  Profile,
  profileKey,
  Contact,
  contactKey,
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

/**
 * Finds a profile by user Id.
 */
export const findProfileByUserId = async (
  context: IoContext,
  id: UID<User>,
): Promise<Entity<Profile> | undefined> => {
  const results = await context.database.read({
    [profileKey]: {
      $query: {
        $user: {
          $eq: id,
        },
      },
    },
  }, {
    scope: { [profileKey]: 'global' },
  });

  if (!results[profileKey]?.length) {
    return undefined;
  }

  return results[profileKey][0] as Entity<Profile>;
};

/**
 * Finds a contact by id.
 */
export const findContactById = async (
  context: IoContext,
  id: UID<Contact>,
): Promise<Entity<Contact> | undefined> => {
  const results = await context.database.read({
    [contactKey]: {
      $query: {
        $id: {
          $eq: id,
        },
      },
    },
  }, {
    scope: { [contactKey]: 'global' },
  });

  if (!results[contactKey]?.length) {
    return undefined;
  }

  return results[contactKey][0] as Entity<Contact>;
};
