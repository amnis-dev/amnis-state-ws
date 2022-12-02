import {
  dateNumeric,
  JWTAccess,
  Bearer,
  bearerCreate,
  StateEntities,
  Profile,
  profileKey,
  Session,
  sessionCreator,
  sessionKey,
  ioOutput,
  UID,
  Database,
  User,
  userKey,
  IoContext,
  stateEntitiesCreate,
  profileCreator,
  entityCreate,
  Contact,
  contactKey,
  contactCreator,
  Entity,
} from '@amnis/core';
import { processConfig } from '../config.js';

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

  return { ...resultsUser[userKey][0] } as Entity<User>;
}

/**
 * Finds a user by ID.
 */
export async function userFindById(
  database: Database,
  userId: UID<User>,
): Promise<Entity<User> | undefined> {
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

  return { ...resultsUser[userKey][0] } as Entity<User>;
}

/**
 * Creates a session with user and profile data.
 */
export function sessionGenerate(
  user: User,
  profile: Profile,
): Session {
  const sessionExpires = dateNumeric(processConfig.PROCESS_SESSION_LIFE);

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
}

/**
 * Generates a new set of bearers
 */
export async function bearerGenerate(
  user: User,
  context: IoContext,
): Promise<Bearer> {
  const bearerExpires = dateNumeric(processConfig.PROCESS_TOKEN_LIFE);

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
}

/**
 * Creates a Bad Credentials API output.
 */
export function outputBadCredentials() {
  const output = ioOutput();

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
export async function profileFetch(
  database: Database,
  user: User,
): Promise<Entity<Profile> | undefined> {
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
    const profile = entityCreate(profileCreator({
      $user: user.$id,
      nameDisplay: user.name,
    }), { $owner: user.$id, $creator: user.$id });

    const resultDb = await database.create({
      [profileKey]: [profile],
    });

    const profileResult = resultDb[profileKey]?.[0];

    if (!profileResult) {
      return undefined;
    }

    return profileResult as Entity<Profile>;
  }

  return results[profileKey][0] as Entity<Profile>;
}

/**
 * Fetch a profile contact. Create a new one if it doesn't exist.
 */
export async function contactFetch(
  database: Database,
  profile: Profile,
): Promise<Contact | undefined> {
  const results = await database.read({
    [contactKey]: {
      $query: {
        $id: {
          $eq: profile.$contact,
        },
      },
    },
  });

  /**
   * Create a new profile contact and store it if no results were found.
   */
  if (!results[contactKey] || results[contactKey].length < 1) {
    const contact = entityCreate(contactCreator({
      name: `${profile.nameDisplay} Contact`,
    }), { $owner: profile.$user, $creator: profile.$user });

    const resultDb = await database.create({
      [contactKey]: [contact],
    });

    const contactResult = resultDb[contactKey]?.[0];

    if (!contactResult) {
      return undefined;
    }

    // No need to await for this update.
    database.update({
      [profileKey]: [
        {
          $id: profile.$id,
          $contact: contactResult.$id,
        },
      ],
    });

    return contactResult as Entity<Contact>;
  }

  return results[contactKey][0] as Entity<Contact>;
}

/**
 * Processes a successful login with a return result.
 */
export async function loginSuccessProcess(
  context: IoContext,
  user: User,
) {
  const output = ioOutput<StateEntities>();

  const profile = await profileFetch(context.database, user);

  if (!profile) {
    output.status = 500; // Internal Server Error
    output.json.logs.push({
      level: 'error',
      title: 'Profile Missing',
      description: 'Could not find the account profile.',
    });
    return output;
  }

  const contact = await contactFetch(context.database, profile);

  if (!contact) {
    output.status = 500; // Internal Server Error
    output.json.logs.push({
      level: 'error',
      title: 'Contact Information Missing',
      description: 'Could not find the account contact record.',
    });
    return output;
  }

  const session = sessionGenerate(user, profile);

  const bearerAccess = await bearerGenerate(user, context);

  user.password = undefined;

  output.json.result = stateEntitiesCreate({
    [userKey]: [user],
    [profileKey]: [profile],
    [sessionKey]: [session],
    [contactKey]: [contact],
  }, { $creator: user.$id });

  output.json.bearers = [bearerAccess];

  output.cookies.authSession = await context.crypto.sessionEncrypt(session);

  return output;
}
