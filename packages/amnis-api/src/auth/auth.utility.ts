import { cryptConfig } from '@amnis/auth/config';
import { sessionEncode } from '@amnis/auth/session';
import { jwtEncode } from '@amnis/auth/token';

import { dateNumeric } from '@amnis/core/core';
import {
  JWTDecoded, Token, tokenCreate, TokenType,
} from '@amnis/core/token';
import { Profile, profileKey } from '@amnis/core/profile';
import { Session, sessionCreate, sessionKey } from '@amnis/core/session';
import type { Database } from '@amnis/db/types';
import { User, userKey } from '@amnis/core/user';
import type { StateCreate } from '@amnis/core/state';

import { Reference } from '@amnis/core/types';
import { apiOutput } from '../api';

/**
 * Finds a user by name.
 */
export async function userFindByName(
  database: Database,
  username: string,
): Promise<User | undefined> {
  const resultsUser = await database.read({
    [userKey]: {
      $query: {
        name: {
          $eq: username,
        },
      },
    },
  }, {
    scope: { [userKey]: 'global' },
  });

  if (!resultsUser[userKey]?.length) {
    return undefined;
  }

  return { ...resultsUser[userKey][0] } as User;
}

/**
 * Finds a user by ID.
 */
export async function userFindById(
  database: Database,
  userId: Reference<User>,
): Promise<User | undefined> {
  const resultsUser = await database.read({
    [userKey]: {
      $query: {
        $id: {
          $eq: userId,
        },
      },
    },
  }, {
    scope: { [userKey]: 'global' },
  });

  if (!resultsUser[userKey]?.length) {
    return undefined;
  }

  return { ...resultsUser[userKey][0] } as User;
}

/**
 * Creates a session with user and profile data.
 */
export function sessionGenerate(
  user: User,
  profile: Profile,
): Session {
  const sessionExpires = dateNumeric(cryptConfig.AUTH_SESSION_LIFE);

  /**
   * Create the new user session.
   */
  const session = sessionCreate({
    $subject: user.$id,
    exp: sessionExpires,
    admin: false,
    name: profile.nameDisplay,
    dmn: user.domain || '',
    avatar: profile.avatar || null,
  });

  return session;
}

/**
 * Generates a new set of tokens
 */
export function tokenGenerate(
  user: User,
  type: TokenType = 'access',
): Token {
  const tokenExpires = dateNumeric(type === 'access' ? cryptConfig.AUTH_TOKEN_LIFE : '200d');

  /**
   * Create the JWT data.
   */
  const jwtDecoded: JWTDecoded = {
    iss: '',
    sub: user.$id,
    exp: tokenExpires,
    typ: type,
    roles: user.$roles,
  };

  /**
   * Create the token container.
   * This is so we have ensured data about our JWT.
   */
  const tokenAccess = tokenCreate({
    api: 'core',
    exp: tokenExpires,
    jwt: jwtEncode(jwtDecoded),
    type,
  });

  return tokenAccess;
}

/**
 * Creates a Bad Credentials API output.
 */
export function outputBadCredentials() {
  const output = apiOutput();

  output.status = 401; // 401 Unauthorized
  output.json.logs.push({
    level: 'error',
    title: 'Bad Credentials',
    description: 'Username or password is incorrect.',
  });
  return output;
}

/**
 * Fetch a profile. Create a new one if it doesn't exist.
 */
export async function profileFetch(database: Database, user: User): Promise<Profile | undefined> {
  const results = await database.read({
    [profileKey]: {
      $query: {
        $user: {
          $eq: user.$id,
        },
      },
    },
  }, {
    scope: { [userKey]: 'global', [profileKey]: 'global' },
  });

  /**
   * Create a new profile and store it if no results were found.
   */
  if (!results[profileKey] || results[profileKey].length < 1) {
    /**
     * TODO: Find out if creating a new profile if not found
     * is a good choice.
     * The profile should have been created upon registration...
     * but a user can exist without a profile.
     */
    // const profile = profileCreate({
    //   $user: user.$id,
    //   nameDisplay: user.name,
    // });

    // const resultDb = await database.create({
    //   [profileKey]: [profile],
    // });

    // const profileResult = resultDb[profileKey]?.[0] as Profile | undefined;

    return undefined;
  }

  return results[profileKey][0] as Profile;
}

/**
 * Processes a successful login with a return result.
 */
export async function loginSuccessProcess(database: Database, user: User) {
  const output = apiOutput<StateCreate>();

  const profile = await profileFetch(database, user);

  if (!profile) {
    output.status = 500; // Internal Server Error
    output.json.logs.push({
      level: 'error',
      title: 'Profile Missing',
      description: 'Could not find the account profile.',
    });
    return output;
  }

  const session = sessionGenerate(user, profile);

  const tokenAccess = tokenGenerate(user, 'access');

  user.password = null;

  output.json.result = {
    [userKey]: [user],
    [profileKey]: [profile],
    [sessionKey]: [session],
  };

  output.json.tokens = [tokenAccess];

  output.cookies.authSession = sessionEncode(session);

  return output;
}
