import { AUTH_SESSION_LIFE, AUTH_TOKEN_LIFE } from '@amnis/auth/const';
import { sessionEncode } from '@amnis/auth/session';
import { jwtEncode } from '@amnis/auth/token';
import { dateNumeric, entityCreate, tokenStringify } from '@amnis/core/index';
import {
  CoreProfile, CoreSession, CoreUser, Database, JWTDecoded, ResultCreate, Token,
} from '@amnis/core/types';
import { apiOutput } from '../api';

/**
 * Finds a user.
 */
export async function userFind(
  database: Database,
  username: string,
): Promise<CoreUser | undefined> {
  const resultsUser = await database.read({
    user: {
      $query: {
        name: {
          $eq: username,
        },
      },
    },
  }, { user: 'global' });

  if (!resultsUser.user?.length) {
    return undefined;
  }

  return { ...resultsUser.user[0] } as CoreUser;
}

/**
 * Creates a session with user and profile data.
 */
export function sessionCreate(
  user: CoreUser,
  profile: CoreProfile,
  otherTokens?: Token[],
): CoreSession {
  const tokenExpires = dateNumeric(AUTH_TOKEN_LIFE);
  const sessionExpires = dateNumeric(AUTH_SESSION_LIFE);

  /**
   * Create the JWT data.
   */
  const jwtDecoded: JWTDecoded = {
    iss: '',
    sub: user.$id,
    exp: tokenExpires,
    typ: 'access',
    roles: user.$roles,
  };

  /**
   * Create the token container.
   * This is so we have ensured data about our JWT.
   */
  const tokenAccess: Token = {
    api: 'core',
    exp: tokenExpires,
    jwt: jwtEncode(jwtDecoded),
    type: 'access',
  };

  const additionalTokens = otherTokens?.map((token) => tokenStringify(token)) || [];

  /**
   * Create the new user session.
   */
  const session = entityCreate<CoreSession>('session', {
    $subject: user.$id,
    exp: sessionExpires,
    admin: false,
    tokens: [
      tokenStringify(tokenAccess),
      ...additionalTokens,
    ],
    name: profile.nameDisplay,
    dmn: user.domain || 'core',
    avatar: profile.avatar || null,
  });

  return session;
}

/**
 * Creates a Bad Credentials API output.
 */
export function outputBadCredentials() {
  const output = apiOutput();

  output.status = 401; // 401 Unauthorized
  output.json.errors = [
    {
      title: 'Bad Credentials',
      message: 'Username or password is incorrect.',
    },
  ];
  return output;
}

/**
 * Fetch a profile. Create a new one if it doesn't exist.
 */
export async function profileFetch(database: Database, user: CoreUser): Promise<CoreProfile> {
  const results = await database.read({
    profile: {
      $query: {
        $user: {
          $eq: user.$id,
        },
      },
    },
  }, { user: 'global' });

  /**
   * Create a new profile and store it if no results were found.
   */
  if (!results.profile?.length) {
    const profile: CoreProfile = entityCreate<CoreProfile>('profile', {
      $user: user.$id,
      nameDisplay: user.name,
    }, { $owner: user.$id });

    database.create({
      profile: [profile],
    });

    return profile;
  }

  return results.profile[0] as CoreProfile;
}

/**
 * Processes a successful login with a return result.
 */
export async function loginSuccessProcess(database: Database, user: CoreUser) {
  const output = apiOutput<ResultCreate>();

  const profile = await profileFetch(database, user);

  const session = sessionCreate(user, profile);

  user.password = null;

  output.json.result = {
    user: [user],
    profile: [profile],
    session: [session],
  };

  output.cookies.session = sessionEncode(session);

  return output;
}

export default {
  userFind,
  outputBadCredentials,
  loginSuccessProcess,
};
