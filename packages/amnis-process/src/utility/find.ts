import {
  Entity,
  IoContext,
  UID,
  User,
  userKey,
} from '@amnis/core';

/**
 * Finds a user by Id.
 */
export const findUserById = async ({ database }: IoContext, id: UID) => {
  const resultsUser = await database.read({
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

  if (!resultsUser[userKey]?.length) {
    return undefined;
  }

  return resultsUser[userKey][0] as Entity<User>;
};

/**
 * Finds a user by Id.
 */
export const findUserByName = async ({ database }: IoContext, name: string) => {
  const resultsUser = await database.read({
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

  if (!resultsUser[userKey]?.length) {
    return undefined;
  }

  return resultsUser[userKey][0] as Entity<User>;
};
