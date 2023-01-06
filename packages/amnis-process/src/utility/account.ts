import {
  contactCreator,
  contactKey,
  Credential,
  credentialKey,
  entityCreate,
  handleCreator,
  handleKey,
  IoContext,
  ioOutput,
  IoOutput,
  profileCreator,
  profileKey,
  StateCreator,
  StateEntities,
  stateEntitiesCreate,
  StateUpdater,
  User,
  userCreator,
  userKey,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { findUserByHandle } from './find.js';

/**
 * Options for creating an account.
 */
export interface AccountCreateOptions {
  /**
   * The handle for the account. Also called the handle.
   */
  handle: string;
  /**
   * The password to set for the account.
   */
  password: string;
  /**
   * Account email for recovery.
   */
  email?: string;
  /**
   * Sets the profile display name.
   * Defaults to the handle.
   */
  nameDisplay?: string;
  /**
   * Optionally set a credential when this account is created.
   * NOTE: Without a credential, authentication is impossible.
   * The credential can be added later.
   */
  credential?: Credential;
}

/**
 * Creates a new account.
 */
export const accountCreate = async (
  context: IoContext,
  options: AccountCreateOptions,
): Promise<IoOutput<StateEntities | undefined>> => {
  const output = ioOutput();
  const { store, database, crypto } = context;

  const {
    handle,
    password,
    email,
    nameDisplay,
    credential,
  } = options;

  /**
   * Ensure the handle name doesn't already exist in the database.
   */
  const userFound = await findUserByHandle(context, handle);

  if (userFound) {
    output.status = 500;
    output.json.logs.push({
      level: 'error',
      title: 'Handle Already Registered',
      description: `The handle "${handle}" has already been registered.`,
    });
    return output;
  }

  /**
   * Get the initial roles for a newly created user.
   */
  const systemActive = systemSelectors.selectActive(store.getState());

  if (!systemActive) {
    output.status = 500;
    output.json.logs.push({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available for creating an account.',
    });
    return output;
  }

  /**
   * Fetch the initial roles from system settings for the new account.
   */
  const { $initialRoles } = systemActive;

  /**
   * Hash the given password.
   */
  const passwordHashed = await crypto.passHash(password);

  /**
   * Create the new contact to link to the account profile.
   */
  const contact = contactCreator({
    name: handle,
  });

  /**
   * Initialize the new user creator.
   */
  const user = userCreator({
    handle,
    password: passwordHashed,
    email,
    $roles: $initialRoles,
  });

  /**
   * Create a handle reference.
   */
  const handleCreate = handleCreator({
    name: handle,
    $subject: user.$id,
  });

  /**
   * Add credentials to the user if set.
   */
  if (credential) {
    user.$credentials.push(credential.$id);
  }

  /**
   * Create a new profile
   */
  const profile = profileCreator({
    nameDisplay: nameDisplay ?? handle,
    $user: user.$id,
    $contact: contact.$id,
  });

  /**
   * Initalize an entities object to commit.
   */
  const stateEntities: StateEntities = stateEntitiesCreate({
    [userKey]: [user],
    [handleKey]: [handleCreate],
    [profileKey]: [profile],
    [contactKey]: [contact],
  }, { $owner: user.$id, new: false, committed: true });

  /**
   * Append credentials if set.
   */
  if (credential) {
    stateEntities[credentialKey] = [
      entityCreate(credential, { $owner: user.$id, new: false, committed: true }),
    ];
  }

  /**
   * Commit the new data into the database.
   */
  database.create(stateEntitiesCreate(stateEntities));

  output.status = 200;
  output.json.result = stateEntities;
  output.json.logs.push({
    level: 'success',
    title: 'Account Created',
    description: `The new account "${handle}" has been registered.`,
  });

  return output;
};

/**
 * Adds a new credential to a user.
 */
export const accountCredentialAdd = async (
  context: IoContext,
  user: User,
  credential: Credential,
): Promise<IoOutput<StateEntities | undefined>> => {
  const output = ioOutput();
  const { database } = context;

  const $credentials = [...user.$credentials, credential.$id];

  const stateCreator: StateCreator = {
    [credentialKey]: [credential],
  };
  const stateEntities = stateEntitiesCreate(stateCreator);
  const resultCreate = await database.create(stateEntities);

  if (!resultCreate[credentialKey] || !resultCreate[credentialKey].length) {
    output.status = 500;
    output.json.logs.push({
      level: 'error',
      title: 'Credential Not Created',
      description: 'Could not create the provide credential.',
    });
    return output;
  }

  const stateUpdater: StateUpdater = {
    [userKey]: [
      {
        $id: user.$id,
        $credentials,
      },
    ],
  };

  const resultUpdate = await database.update(stateUpdater);

  output.status = 200;
  output.json.result = {
    ...resultCreate,
    ...resultUpdate,
  };
  output.json.logs.push({
    level: 'success',
    title: 'Credential Added',
    description: 'The new credential has been added.',
  });

  return output;
};
