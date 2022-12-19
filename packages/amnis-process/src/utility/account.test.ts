import {
  contactKey,
  Credential,
  credentialCreator,
  credentialKey,
  cryptoWeb,
  databaseMemoryClear,
  Entity,
  IoContext,
  ioOutputErrored,
  profileKey,
  User,
  userKey,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { accountCreate, accountCredentialAdd } from './account.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup();
});

afterEach(() => {
  databaseMemoryClear();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create a new account with minial options', async () => {
  const handle = 'newbie';
  const password = 'passwd12';
  const output = await accountCreate(
    context,
    {
      handle,
      password,
    },
  );

  expect(output.status).toBe(200);
  expect(output.json.logs).toHaveLength(1);
  expect(ioOutputErrored(output)).toBe(false);

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result)).toHaveLength(3);

  const users = result[userKey] as Entity<User>[];
  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    name: handle,
    password: expect.any(String),
    $credentials: [],
    $owner: users[0].$id,
  });
  const isPasswordSame = await cryptoWeb.passCompare(password, users[0].password ?? '');
  expect(isPasswordSame).toBe(true);

  const contacts = result[contactKey];
  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({
    name: handle,
    $owner: users[0].$id,
  });

  const profiles = result[profileKey];
  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0]).toMatchObject({
    nameDisplay: handle,
    $user: users[0].$id,
    $contact: contacts[0].$id,
    $owner: users[0].$id,
  });

  expect(result[credentialKey]).toBeUndefined();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should NOT create a new account with the same handles', async () => {
  const handle = 'newbie';
  const password = 'passwd12';
  const outputFirst = await accountCreate(
    context,
    {
      handle,
      password,
    },
  );

  expect(outputFirst.status).toBe(200);
  expect(outputFirst.json.logs).toHaveLength(1);
  expect(ioOutputErrored(outputFirst)).toBe(false);

  const outputSecond = await accountCreate(
    context,
    {
      handle,
      password,
    },
  );

  expect(outputSecond.status).toBe(500);
  expect(outputSecond.json.logs).toHaveLength(1);
  expect(ioOutputErrored(outputSecond)).toBe(true);

  const { result } = outputSecond.json;
  expect(result).toBeUndefined();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create a new account with different display name', async () => {
  const handle = 'newbie';
  const password = 'passwd12';
  const nameDisplay = 'Newbie Newbert';
  const output = await accountCreate(
    context,
    {
      handle,
      password,
      nameDisplay,
    },
  );

  expect(output.status).toBe(200);
  expect(output.json.logs).toHaveLength(1);
  expect(ioOutputErrored(output)).toBe(false);

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result)).toHaveLength(3);

  const users = result[userKey];
  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    name: handle,
    password: expect.any(String),
    $credentials: [],
    $owner: users[0].$id,
  });

  const contacts = result[contactKey];
  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({
    name: handle,
    $owner: users[0].$id,
  });

  const profiles = result[profileKey];
  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0]).toMatchObject({
    nameDisplay,
    $user: users[0].$id,
    $contact: contacts[0].$id,
    $owner: users[0].$id,
  });

  expect(result[credentialKey]).toBeUndefined();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should create a new account with a credential', async () => {
  const handle = 'newbie';
  const password = 'passwd12';
  const credential = credentialCreator({
    name: 'Jest Agent',
    publicKey: '1234abcd',
  });
  const output = await accountCreate(
    context,
    {
      handle,
      password,
      credential,
    },
  );

  expect(output.status).toBe(200);
  expect(output.json.logs).toHaveLength(1);
  expect(ioOutputErrored(output)).toBe(false);

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result)).toHaveLength(4);

  const credentials = result[credentialKey];
  expect(credentials).toBeDefined();
  expect(credentials).toHaveLength(1);
  expect(credentials[0]).toMatchObject({
    name: 'Jest Agent',
    publicKey: '1234abcd',
  });

  const users = result[userKey];
  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    name: handle,
    password: expect.any(String),
    $credentials: [credentials[0].$id],
    $owner: users[0].$id,
  });

  const contacts = result[contactKey];
  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({
    name: handle,
    $owner: users[0].$id,
  });

  const profiles = result[profileKey];
  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0]).toMatchObject({
    nameDisplay: handle,
    $user: users[0].$id,
    $contact: contacts[0].$id,
    $owner: users[0].$id,
  });
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should add credential to existing user', async () => {
  const handle = 'newbie';
  const password = 'passwd12';
  const outputAccount = await accountCreate(
    context,
    {
      handle,
      password,
    },
  );

  const userAccount = outputAccount.json.result?.[userKey]?.[0] as Entity<User>;

  if (!userAccount) {
    expect(userAccount).toBeDefined();
    return;
  }

  const credentialNew = credentialCreator({
    name: 'Jest Agent',
    publicKey: '1234abcd',
  });
  const output = await accountCredentialAdd(
    context,
    userAccount,
    credentialNew,
  );

  expect(output.status).toBe(200);
  expect(output.json.logs).toHaveLength(1);
  expect(ioOutputErrored(output)).toBe(false);

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result)).toHaveLength(2);
  expect(result[userKey]).toHaveLength(1);
  expect(result[credentialKey]).toHaveLength(1);

  const credential = result[credentialKey][0] as Entity<Credential>;
  expect(credential).toMatchObject({
    name: 'Jest Agent',
    publicKey: '1234abcd',
  });

  const user = result[userKey][0] as Entity<User>;
  expect(user).toBeDefined();
  expect(user).toMatchObject({
    $id: userAccount.$id,
    $credentials: [credential.$id],
  });
});
