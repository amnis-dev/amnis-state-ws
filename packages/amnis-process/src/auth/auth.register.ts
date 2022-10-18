import {
  Database,
  IoOutput,
  ioOutput,
  LogBaseCreate,
  profileCreate,
  StateCreate,
  System,
  Token,
  userCheck,
  userCreate,
} from '@amnis/core/index.js';
import { sessionEncode } from '../index.js';

import { sessionGenerate, tokenGenerate } from './auth.utility.js';

/**
 * Options when processsing a registration.
 */
interface RegisterOptions {
  nameDisplay?: string;
  email?: string;
  password?: string;
  createSession?: boolean;
  withTokens?: boolean;
  otherTokens?: Token[];
}

/**
 * Create an API Outputs registering an account.
 */
export async function register(
  database: Database,
  system: System | undefined,
  username: string,
  options: RegisterOptions,
): Promise<IoOutput<StateCreate>> {
  const {
    password, nameDisplay, createSession, withTokens, otherTokens,
  } = options;
  const output = ioOutput<StateCreate>();
  const logs: LogBaseCreate[] = [];

  if (!system) {
    output.status = 503; // Service Unavailable
    output.json.logs.push({
      level: 'error',
      title: 'Service Unavailable',
      description: 'The service has not been configured to handle this request.',
    });
    return output;
  }

  const user = userCreate({
    name: username,
    password: password || null,
    email: options.email,
    $roles: [...system.$initialRoles],
  });

  user.$owner = user.$id;

  logs.push(...userCheck(user));

  const profile = profileCreate({
    $user: user.$id,
    nameDisplay: nameDisplay || username,
  });
  profile.$owner = user.$id;

  /**
   * If there were issues with the creations, there'll be logs.
   */
  if (logs.length > 0) {
    output.status = 400; // Bad Request
    output.json.logs = logs;
    return output;
  }

  const insertion: StateCreate = {
    user: [user],
    profile: [profile],
  };

  /**
   * StateCreate newly created user and profile into the database.
   */
  const resultDbCreate = await database.create(insertion, {
    scope: { user: 'global', profile: 'global' },
  });
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
  if (withTokens === true) {
    output.json.tokens = [tokenGenerate(user)];

    if (otherTokens?.length) {
      output.json.tokens.push(...otherTokens);
    }
  }

  output.json.logs.push({
    level: 'success',
    title: 'Registration Successful',
    description: 'A new account has been created.',
  });

  return output;
}

export default { register };
