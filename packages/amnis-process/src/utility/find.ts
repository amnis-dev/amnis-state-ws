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
  HandleName,
  Handle,
  HandleNameId,
  Role,
  roleKey,
  coreActions,
} from '@amnis/core';
import {
  credentialActions,
  credentialSelectors,
  roleSelectors,
  userActions,
  userSelectors,
} from '@amnis/state';

/**
 * Finds a user by ID.
 */
export const findUserById = async (
  context: IoContext,
  $id: UID<User>,
): Promise<Entity<User> | undefined> => {
  const { store, database } = context;

  let user: Entity<User> | undefined;
  user = userSelectors.selectById(store.getState(), $id);

  if (!user) {
    const results = await database.read({
      [userKey]: {
        $query: {
          $id: {
            $eq: $id,
          },
        },
      },
    });
    user = results[userKey]?.[0] as Entity<User> | undefined;

    if (user) {
      store.dispatch(userActions.insert(user));
    }
  }

  return user;
};

/**
 * Finds a user by handle.
 */
export const findUserByHandle = async (
  context: IoContext,
  handle: HandleName,
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

  return findUserById(context, handleEntity.$subject);
};

/**
 * Finds a user by ID or handle.
 */
export const findUser = async (
  context: IoContext,
  ref: UID | HandleNameId,
): Promise<Entity<User> | undefined> => {
  const magic = ref.charAt(0);
  if (magic === '@') {
    return findUserByHandle(context, ref.slice(1) as HandleName);
  }

  return findUserById(context, ref as UID);
};

/**
 * Finds a credential by ID.
 */
export const findCredentialById = async (
  context: IoContext,
  $id: UID<Credential>,
): Promise<Entity<Credential> | undefined> => {
  const { store, database } = context;

  let credential: Entity<Credential> | undefined;
  credential = credentialSelectors.selectById(store.getState(), $id);

  if (!credential) {
    const results = await database.read({
      [credentialKey]: {
        $query: {
          $id: {
            $eq: $id,
          },
        },
      },
    });
    credential = results[credentialKey]?.[0] as Entity<Credential> | undefined;

    if (credential) {
      store.dispatch(credentialActions.insert(credential));
    }
  }

  return credential;
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
  });

  if (!results[contactKey]?.length) {
    return undefined;
  }

  return results[contactKey][0] as Entity<Contact>;
};

/**
 * Find roles by ids.
 */
export const findRolesByIds = async (
  context: IoContext,
  ids: UID<Role>[],
): Promise<Entity<Role>[]> => {
  const { store, database } = context;
  /**
   * Attempt to find the roles in the store cache first.
   */
  const state = store.getState();
  const roles = ids
    .map((id) => roleSelectors.selectById(state, id))
    .filter((role) => role !== undefined) as Entity<Role>[];

  /**
   * If all roles were found, no database query is needed...
   */
  if (roles.length === ids.length) {
    return roles;
  }

  /**
   * Roles were missing from cache. Fetch from the database.
   */
  const results = await database.read({
    [roleKey]: {
      $query: {
        $id: {
          $in: ids,
        },
      },
    },
  });

  if (!results[roleKey]?.length) {
    return [];
  }

  /**
   * Store the result into cache.
   */
  store.dispatch(coreActions.insert(results));

  return results[roleKey] as Entity<Role>[];
};
