import { sessionEncode } from '@amnis/auth/session';
import {
  entityCreate,
  userCreate,
} from '@amnis/core/index';
import {
  Profile,
  Database,
  Insert,
  ResultCreate,
  Token,
} from '@amnis/core/types';
import { apiOutput } from '../api';
import { ApiOutput } from '../types';
import { sessionCreate } from './auth.protility';

/**
 * Options when processsing a registration.
 */
interface RegisterOptions {
  nameDisplay?: string;
  email?: string;
  password?: string;
  createSession?: boolean;
  tokens?: Token[];
}

/**
 * Create an API Outputs registering an account.
 */
export async function register(
  database: Database,
  username: string,
  options: RegisterOptions,
): Promise<ApiOutput<ResultCreate>> {
  const {
    password, nameDisplay, createSession, tokens,
  } = options;
  const output = apiOutput();

  const [user, logs] = userCreate({
    name: username,
    password: password || null,
    email: options.email,
  });

  /**
   * If there were issues with the user creatios, there'll be logs.
   */
  if (logs.length > 0) {
    output.status = 400; // Bad Request
    output.json.logs = logs;
    return output;
  }

  const profile = entityCreate<Profile>('profile', {
    $user: user.$id,
    nameDisplay: nameDisplay || username,
  });

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
    const session = sessionCreate(user, profile, tokens);
    output.json.result.session = [session];
    output.cookies.session = sessionEncode(session);
  }

  return output;
}

export default { register };
