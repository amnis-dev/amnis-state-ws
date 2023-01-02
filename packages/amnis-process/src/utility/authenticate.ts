import {
  IoContext,
  IoOutput,
  ioOutput,
  User,
  StateEntities,
  entityCreate,
  userKey,
  profileKey,
  contactKey,
  sessionKey,
  dateJSON,
  StateUpdater,
  credentialKey,
  ApiAuthLogin,
  UID,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import {
  findContactById,
  findCredentialById,
  findProfileByUserId,
  findUserByHandle,
  findUserById,
} from './find.js';
import { generateBearer, generateSession } from './generate.js';

const authenticateFailedOutput = (subtitle: string, description: string) => {
  const output = ioOutput();
  output.status = 401; // Unauthorized
  output.json.logs.push({
    level: 'error',
    title: `Authentication Failed: ${subtitle}`,
    description,
  });
  return output;
};

const authenticateFinalizeFailedOutput = (title: string, description: string) => {
  const output = ioOutput();
  output.status = 500; // Unauthorized
  output.json.logs.push({
    level: 'error',
    title,
    description,
  });
  return output;
};

/**
 * Finalize the user authentication by generating a session, token, and
 * returning account data. This does not verify any login parameters.
 *
 * Use authenticateLogin to authenticate securely.
 */
export const authenticateFinalize = async (
  context: IoContext,
  $user: UID<User>,
  $credential: UID<Credential>,
): Promise<IoOutput<StateEntities>> => {
  const user = await findUserById(context, $user);

  if (!user) {
    return authenticateFinalizeFailedOutput(
      'No User',
      'No user information was found with the provided account data.',
    );
  }

  if (user.$credentials.indexOf($credential) < 0) {
    return authenticateFinalizeFailedOutput(
      'No Credential',
      'No credential information was found with the provided account data.',
    );
  }

  const profile = await findProfileByUserId(context, user.$id);

  if (!profile) {
    return authenticateFinalizeFailedOutput(
      'No Profile',
      'No profile information was found with the provided account data.',
    );
  }

  if (!profile.$contact) {
    return authenticateFinalizeFailedOutput(
      'No Contact Relation',
      'There is no contact information associated with the provided user account\'s profile.',
    );
  }

  const contact = await findContactById(context, profile.$contact);

  if (!contact) {
    return authenticateFinalizeFailedOutput(
      'No Contact',
      'No contact information was found with the provided user account\'s profile.',
    );
  }

  /**
   * Get the active system.
   */
  const system = systemSelectors.selectActive(context.store.getState());

  if (!system) {
    const output = ioOutput();
    output.status = 500;
    output.json.logs.push({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available to complete the login.',
    });
    return output;
  }

  /**
   * Find the credentials in the database.
   */
  const credential = await findCredentialById(context, $credential);

  if (!credential) {
    return authenticateFailedOutput(
      'Missing Credential',
      'The provided credential could not be found.',
    );
  }

  /**
   * Create the authenticated user's session.
   */
  const sessionBase = await generateSession(
    system,
    user.$id,
    credential.$id,
    user.$roles,
  );

  const session = entityCreate(sessionBase, { $owner: user.$id });
  const sessionEncrypted = await context.crypto.sessionEncrypt(sessionBase);

  /**
   * Create the authenticated user's access bearer token.
   */
  const bearerAccess = await generateBearer(context, system, user.$id, user.$roles);

  const stateEntities: StateEntities = {
    [userKey]: [user],
    [profileKey]: [profile],
    [contactKey]: [contact],
    [sessionKey]: [session],
  };

  const output = ioOutput();
  output.json.result = stateEntities;
  output.cookies.authSession = sessionEncrypted;
  output.json.bearers = [bearerAccess];

  output.json.logs.push({
    level: 'success',
    title: 'Authentication Successful',
    description: 'Credential has been verified.',
  });

  return output;
};

/**
 * Authenticates securely by verifying login parameters.
 */
export const authenticateLogin = async (
  context: IoContext,
  login: ApiAuthLogin,
): Promise<IoOutput> => {
  const { handle, $credential, password } = login;

  /**
   * Find the user
   */
  const user = await findUserByHandle(context, handle);

  if (!user) {
    return authenticateFailedOutput(
      'User Not Found',
      `Could not find handle "${user}".`,
    );
  }

  if (user.locked) {
    return authenticateFailedOutput(
      'Account Locked',
      'This account has been locked.',
    );
  }

  /**
   * Check if there's a password and it matches the user's password.
   */
  const passwordMatched = (password && user.password)
    ? await context.crypto.passCompare(password, user.password) : false;

  /**
   * Find the credentials on the user.
   */
  if (!user.$credentials.includes($credential)) {
    if (passwordMatched) {
      const output = ioOutput();
      output.status = 401; // Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unknown Agent',
        description: 'The client agent requesting authentication is unrecognized.',
      });
      return output;
    }
    return authenticateFailedOutput(
      'Invalid Credential',
      'The provided credential is not valid for this user.',
    );
  }

  if (!passwordMatched) {
    return authenticateFailedOutput(
      'Wrong Password',
      'The provided password is incorrect.',
    );
  }

  /**
   * Update the credential timestamps.
   */
  const updater: StateUpdater = {
    [credentialKey]: [{
      $id: $credential,
      updated: dateJSON(),
      used: dateJSON(),
    }],
  };
  context.database.update(updater);

  /**
   * All authentication checks can been completed.
   */
  const output = await authenticateFinalize(context, user.$id, $credential);

  return output;
};
