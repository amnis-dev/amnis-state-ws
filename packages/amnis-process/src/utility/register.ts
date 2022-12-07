import {
  IoContext,
  ioOutput,
  IoOutput,
  StateEntities,
  AuthRegistrationParsed,
  credentialCreator,
  contactCreator,
  profileCreator,
  userCreator,
  logCreator,
  stateEntitiesCreate,
  userKey,
  profileKey,
  contactKey,
  credentialKey,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { findUserByName } from './find.js';

/**
 * Accounts the registration process creating and return the new account information.
 */
export const registerAccount = async (
  context: IoContext,
  authRegistrationParsed: AuthRegistrationParsed,
  ip?: string,
): Promise<IoOutput<StateEntities>> => {
  /**
   * Ensure the username doesn't already exist in the database.
   */
  const foundUser = await findUserByName(context, authRegistrationParsed.username);

  if (foundUser) {
    const output = ioOutput();
    output.status = 500;
    output.json.logs.push(logCreator({
      level: 'error',
      title: 'Username Already Registered',
      description: `The username "${authRegistrationParsed.username}" has already been registered.`,
    }));
    return output;
  }

  /**
   * Get the initial roles for a newly created user.
   */
  const systemActive = systemSelectors.selectActive(context.store.getState());

  if (!systemActive) {
    const output = ioOutput();
    output.status = 500;
    output.json.logs.push(logCreator({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available to complete the registration.',
    }));
    return output;
  }

  const rolesInitial = systemActive.$initialRoles;

  /**
   * Create the new credential to store in the database.
   */
  const credential = credentialCreator({
    name: authRegistrationParsed.credential.name,
    publicKey: authRegistrationParsed.credential.publicKey,
    ip,
  });

  /**
   * Create the new contact to link to the account profile.
   */
  const contact = contactCreator({
    name: authRegistrationParsed.username,
  });

  /**
   * Create a new user.
   */
  const user = userCreator({
    name: authRegistrationParsed.username,
    $credentials: [credential.$id],
    $roles: rolesInitial,
  });

  /**
   * Create a new profile
   */
  const profile = profileCreator({
    nameDisplay: authRegistrationParsed.displayName,
    $user: user.$id,
    $contact: contact.$id,
  });

  /**
   * Initalize an entities object to commit.
   */
  const stateEntities: StateEntities = stateEntitiesCreate({
    [userKey]: [user],
    [profileKey]: [profile],
    [contactKey]: [contact],
    [credentialKey]: [credential],
  }, { $owner: user.$id });

  /**
   * Commit the new data into the database.
   */
  const resultDatabase = await context.database.create(stateEntitiesCreate(stateEntities));

  const output = ioOutput<StateEntities>();
  output.status = 200;
  output.json.result = resultDatabase;
  output.json.logs.push(logCreator({
    level: 'success',
    title: 'Account Registered',
    description: `The new account "${authRegistrationParsed.username}" has been registered.`,
  }));

  return output;
};

export default { registerAccount };
