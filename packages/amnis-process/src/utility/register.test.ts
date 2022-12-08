import {
  authRegistrationCreate,
  authRegistrationParse,
  challengeCreator,
  Contact,
  contactKey,
  credentialKey,
  Credential,
  Entity,
  IoContext,
  Profile,
  profileKey,
  User,
  userKey,
} from '@amnis/core';
import { contextSetup, systemSelectors } from '@amnis/state';
import { registerAccount } from './register.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup();
});

test('should register a new account', async () => {
  const challenge = challengeCreator({
    value: await context.crypto.randomString(16),
  });

  const [authRegistration] = await authRegistrationCreate({
    agent: 'Jest Test Agent',
    username: 'new_user',
    displayName: 'New User',
    password: 'passwd12',
    challenge,
  });

  const authRegistrationParsed = await authRegistrationParse(authRegistration);

  if (!authRegistrationParsed) {
    expect(authRegistrationParsed).toBeDefined();
    return;
  }

  const result = await registerAccount(
    context,
    authRegistrationParsed,
  );

  expect(result.status).toBe(200);

  const { logs, result: entities } = result.json;

  if (!entities) {
    expect(entities).toBeDefined();
    return;
  }

  const systemActive = systemSelectors.selectActive(context.store.getState());

  const users = entities[userKey] as Entity<User>[];
  const profiles = entities[profileKey] as Entity<Profile>[];
  const contacts = entities[contactKey] as Entity<Contact>[];
  const credentials = entities[credentialKey] as Entity<Credential>[];

  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0].$roles).toEqual(systemActive?.$initialRoles);
  expect(users[0].$owner).toEqual(users[0].$id);

  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0].$owner).toEqual(users[0].$id);

  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0].$owner).toEqual(users[0].$id);

  expect(credentials).toBeDefined();
  expect(credentials).toHaveLength(1);
  expect(credentials[0].$owner).toEqual(users[0].$id);

  expect(logs).toHaveLength(1);
  expect(logs[0].level).toBe('success');
  expect(logs[0].title).toBe('Account Registered');
});

test('should not register with an existing username', async () => {
  const challenge = challengeCreator({
    value: await context.crypto.randomString(16),
  });

  const [authRegistration] = await authRegistrationCreate({
    agent: 'Jest Test Agent',
    username: 'new_user',
    displayName: 'New User',
    password: 'passwd12',
    challenge,
  });

  const authRegistrationParsed = await authRegistrationParse(authRegistration);

  if (!authRegistrationParsed) {
    expect(authRegistrationParsed).toBeDefined();
    return;
  }

  const result = await registerAccount(
    context,
    authRegistrationParsed,
  );

  expect(result.status).toBe(500);
  expect(result.json.result).toBeUndefined();
  expect(result.json.logs[0].level).toBe('error');
  expect(result.json.logs[0].title).toBe('Username Already Registered');
});
