import { sessionEncode } from '@amnis/auth/session';
import { entityCreate } from '@amnis/core/index';
import {
  Profile,
  User,
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

  if (password !== undefined && /^[A-Za-z0-9]*/.test(username)) {
    output.status = 400; // Bad Request
    output.json.errors.push({
      title: 'Bad Username',
      message: 'Usernames can only contain alphanumeric characters.',
    });
    return output;
  } if (username.charAt(2) !== '#') {
    output.status = 400; // Bad Request
    output.json.errors.push({
      title: 'Bad Username',
      message: 'Username of passwordless accounts must have a hash character.',
    });
    return output;
  }

  const user = entityCreate<User>('user', {
    name: username,
    password: password || null,
    $roles: [],
    $permits: [],
  });

  /** */
  if (typeof options.email === 'string') {
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(options.email)) {
      user.email = options.email;
    } else {
      output.json.errors.push({
        title: 'Bad Email',
        message: 'Email address is not structured properly.',
      });
      return output;
    }
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
