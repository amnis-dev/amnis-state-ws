import { sessionEncode } from '@amnis/auth/session';
import { profileCreate } from '@amnis/core/profile';
import { Insert, StateCreate } from '@amnis/core/state';
import { Token } from '@amnis/core/token';
import type { Database } from '@amnis/db/types';
import { userCreate } from '@amnis/core/user';

import { apiOutput } from '../api';
import { ApiOutput } from '../types';
import { sessionGenerate, tokenGenerate } from './auth.utility';

/**
 * Options when processsing a registration.
 */
interface RegisterOptions {
  nameDisplay?: string;
  email?: string;
  password?: string;
  createSession?: boolean;
  otherTokens?: Token[];
}

/**
 * Create an API Outputs registering an account.
 */
export async function register(
  database: Database,
  username: string,
  options: RegisterOptions,
): Promise<ApiOutput<StateCreate>> {
  const {
    password, nameDisplay, createSession, otherTokens,
  } = options;
  const output = apiOutput<StateCreate>();

  const logs = [];

  const [user, userLogs] = userCreate({
    name: username,
    password: password || null,
    email: options.email,
  });

  user.$owner = user.$id;

  logs.push(...userLogs);

  const [profile, profileLogs] = profileCreate({
    $user: user.$id,
    nameDisplay: nameDisplay || username,
  });
  profile.$owner = user.$id;

  logs.push(...profileLogs);

  /**
   * If there were issues with the creations, there'll be logs.
   */
  if (logs.length > 0) {
    output.status = 400; // Bad Request
    output.json.logs = logs;
    return output;
  }

  const insertion: Insert = {
    user: [user],
    profile: [profile],
  };

  /**
   * Insert newly created user and profile into the database.
   */
  const resultDbCreate = await database.create(insertion, { user: 'global', profile: 'global' });
  output.json.result = resultDbCreate;

  /**
   * Create a session entity if needed.
   */
  if (createSession === true) {
    const session = sessionGenerate(user, profile);
    session.$owner = user.$id;
    output.json.result.session = [session];
    output.cookies.authSession = sessionEncode(session);
  }

  /**
   * Return tokens
   */
  output.json.tokens = [tokenGenerate(user)];

  if (otherTokens?.length) {
    output.json.tokens.push(...otherTokens);
  }

  output.json.logs.push({
    level: 'success',
    title: 'Registration Successful',
    description: 'A new account has been created.',
  });

  return output;
}

export default { register };
