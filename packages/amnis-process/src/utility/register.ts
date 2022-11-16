import {
  contactCreate,
  IoOutput,
  ioOutput,
  LogBaseCreate,
  profileCreate,
  StateCreate,
  System,
  Bearer,
  userCheck,
  userCreate,
  IoContext,
} from '@amnis/core';
import { sessionGenerate, bearerGenerate } from './common.js';

/**
 * Options when processsing a registration.
 */
interface RegisterOptions {
  nameDisplay?: string;
  email?: string;
  password?: string;
  createSession?: boolean;
  withTokens?: boolean;
  otherTokens?: Bearer[];
}

/**
 * Create an API Outputs registering an account.
 */
export async function register(
  context: IoContext,
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
    email: options.email,
    $roles: [...system.$initialRoles],
  });
  if (password) {
    user.password = await context.crypto.passHash(password);
  }

  user.$owner = user.$id;

  logs.push(...userCheck(user));

  const profile = profileCreate({
    $user: user.$id,
    nameDisplay: nameDisplay || username,
  }, { $owner: user.$id });

  const contact = contactCreate({
    name: profile.nameDisplay,
  }, { $owner: user.$id });
  profile.$contact = contact.$id;
  if (user.email) {
    contact.emails.push(user.email);
  }

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
    contact: [contact],
  };

  /**
   * StateCreate newly created user and profile into the database.
   */
  const resultDbCreate = await context.database.create(insertion, {
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
    output.cookies.authSession = await context.crypto.sessionEncode(session);
  }

  /**
   * Return bearers
   */
  if (withTokens === true) {
    output.json.bearers = [await bearerGenerate(user, context)];

    if (otherTokens?.length) {
      output.json.bearers.push(...otherTokens);
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
