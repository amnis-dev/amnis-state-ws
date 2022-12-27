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
  handleKey,
  Handle,
} from '@amnis/core';

/**
 * Finds a user by handle.
 */
export const findUserByHandle = async (
  context: IoContext,
  handle: string,
): Promise<Entity<User> | undefined> => {
  const resultsHandle = await context.database.read({
    [handleKey]: {
      $query: {
        name: {
          $eq: handle,
        },
      },
    },
  });

  const handleEntity = resultsHandle[handleKey]?.[0] as Entity<Handle> | undefined;

  if (!handleEntity) {
    return undefined;
  }

  const results = await context.database.read({
    [userKey]: {
      $query: {
        $id: {
          $eq: handleEntity.$subject,
        },
      },
    },
  });

  if (!results[userKey]?.length) {
    return undefined;
  }

  return results[userKey][0] as Entity<User>;
};

/**
 * Finds a user by ID.
 */
export const findUserById = async (
  context: IoContext,
  id: UID<User>,
): Promise<Entity<User> | undefined> => {
  const results = await context.database.read({
    [userKey]: {
      $query: {
        $id: {
          $eq: id,
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
