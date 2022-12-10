import {
  schemaAuth,
  IoContext,
  accountsGet,
  IoInput,
  AuthLogin,
  StateEntities,
  challengeKey,
  Challenge,
  cryptoWeb,
  User,
  Entity,
  Profile,
  Contact,
  Session,
  dateNumeric,
  ioOutput,
  authLoginCreate,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { authProcessLogin } from './auth.login.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });
});

test('should start the login ritual', async () => {
  const input: IoInput = {
    body: undefined,
  };

  const output = await authProcessLogin(context)(input, ioOutput());

  expect(output.status).toBe(200);

  if (!output.json.result) {
    expect(output.json.result).toBeDefined();
    return;
  }

  const stateEntities = output.json.result as StateEntities;

  expect(Object.keys(stateEntities)).toHaveLength(1);
  expect(stateEntities).toMatchObject({
    [challengeKey]: expect.any(Array),
  });
});

test('should login as a admin', async () => {
  const { admin: adminAccount } = await accountsGet();

  const inputStart: IoInput = {
    body: undefined,
  };
  const outputStart = await authProcessLogin(context)(inputStart, ioOutput());
  const challenge = outputStart.json.result?.[challengeKey]?.[0] as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const authLogin = await authLoginCreate({
    username: adminAccount.name,
    password: adminAccount.password,
    challenge,
    credential: adminAccount.credential,
    privateKeyWrapped: adminAccount.privateKey,
  });

  const input: IoInput<AuthLogin> = {
    body: authLogin,
  };

  const output = await authProcessLogin(context)(input, ioOutput());

  expect(output.status).toBe(200);
  expect(output.cookies.authSession).toBeDefined();
  expect(output.json.bearers).toBeDefined();
  expect(output.json.bearers?.[0]).toMatchObject({
    id: expect.any(String),
    exp: expect.any(Number),
    access: expect.any(String),
  });

  const users = output.json.result?.user as Entity<User>[];
  const profiles = output.json.result?.profile as Entity<Profile>[];
  const contacts = output.json.result?.contact as Entity<Contact>[];
  const sessions = output.json.result?.session as Entity<Session>[];

  expect(users).toHaveLength(1);
  expect(users[0].name).toBe(adminAccount.name);
  expect(users[0].$credentials?.[0]).toBe(adminAccount.credential.$id);
  expect(users[0].$owner).toBe(users[0].$id);

  expect(profiles).toHaveLength(1);
  expect(profiles[0].$user).toBe(users[0].$id);
  expect(profiles[0].$owner).toBe(users[0].$id);

  expect(contacts).toHaveLength(1);
  expect(contacts[0].$id).toBe(profiles[0].$contact);
  expect(contacts[0].$owner).toBe(users[0].$id);

  expect(sessions).toHaveLength(1);
  expect(sessions[0].$owner).toBe(users[0].$id);
});

test('should NOT login as an admin with different private key', async () => {
  const { admin: adminAccount, user: userAccount } = await accountsGet();

  const inputStart: IoInput = {
    body: undefined,
  };
  const outputStart = await authProcessLogin(context)(inputStart, ioOutput());
  const challenge = outputStart.json.result?.[challengeKey]?.[0] as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const authLogin = await authLoginCreate({
    username: adminAccount.name,
    password: adminAccount.password,
    challenge,
    credential: adminAccount.credential,
    privateKeyWrapped: userAccount.privateKey,
  });

  const input: IoInput<AuthLogin> = {
    body: authLogin,
  };

  const output = await authProcessLogin(context)(input, ioOutput());

  expect(output.status).toBe(401);
  expect(Object.keys(output.cookies)).toHaveLength(0);
  expect(output.json.bearers).toBeUndefined();
  expect(output.json.result).toBeUndefined();

  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0]).toMatchObject({
    level: 'error',
    title: 'Authentication Failed: Improper Attestation',
  });
});

test('should NOT login as an admin with different challenge', async () => {
  const { admin: adminAccount } = await accountsGet();

  const inputStart: IoInput = {
    body: undefined,
  };
  const outputStart = await authProcessLogin(context)(inputStart, ioOutput());
  const challenge = outputStart.json.result?.[challengeKey]?.[0] as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const wrongChallenge: Challenge = {
    $id: challenge.$id,
    value: await cryptoWeb.randomString(32),
    expires: dateNumeric('30m'),
  };

  expect(challenge.$id).toEqual(wrongChallenge.$id);
  expect(challenge?.value).not.toEqual(wrongChallenge.value);

  const authLogin = await authLoginCreate({
    username: adminAccount.name,
    password: adminAccount.password,
    challenge: wrongChallenge,
    credential: adminAccount.credential,
    privateKeyWrapped: adminAccount.privateKey,
  });

  const input: IoInput<AuthLogin> = {
    body: authLogin,
  };

  const output = await authProcessLogin(context)(input, ioOutput());

  expect(output.status).toBe(500);
  expect(Object.keys(output.cookies)).toHaveLength(0);
  expect(output.json.bearers).toBeUndefined();
  expect(output.json.result).toBeUndefined();

  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0]).toMatchObject({
    level: 'error',
    title: 'Invalid Challenge Code',
  });
});
