import {
  IoInput,
  schemaAuth,
  StateEntities,
  challengeKey,
  ioOutputErrored,
  AuthRegistration,
  Challenge,
  authRegistrationCreate,
  IoOutput,
  IoContext,
  userKey,
  profileKey,
  contactKey,
  Entity,
  User,
  Profile,
  Contact,
  sessionKey,
  Session,
  ioOutput,
} from '@amnis/core';
import { contextSetup, systemActions, systemSelectors } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { authProcessChallenge } from './auth.challenge.js';
import { authProcessRegister } from './auth.register.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });
});

test('should start the registration ritual', async () => {
  const input: IoInput = {
    body: {},
  };

  const output = await authProcessChallenge(context)(input, ioOutput());

  expect(output.status).toBe(200);

  if (!output.json.result) {
    expect(output.json.result).toBeDefined();
    return;
  }

  const stateEntities = output.json.result as StateEntities;

  expect(stateEntities).toMatchObject({
    [challengeKey]: expect.any(Array),
  });
});

test('should not register with invalid body input', async () => {
  const input: IoInput = {
    body: { invalid: true },
  };

  const output = await authProcessRegister(context)(input, ioOutput());

  expect(output.status).toBe(400);
  expect(ioOutputErrored(output)).toBe(true);
});

test('should start ritual and complete registration', async () => {
  const inputStart: IoInput = {
    body: {},
  };

  const resultStart = await authProcessChallenge(context)(
    inputStart,
    ioOutput(),
  ) as IoOutput<StateEntities>;

  const challenge = resultStart.json.result?.[challengeKey]?.[0] as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const [authRegistration] = await authRegistrationCreate({
    username: 'new_user',
    displayName: 'New User',
    password: 'passwd12',
    challenge,
  });

  const inputRegister: IoInput<AuthRegistration> = {
    body: authRegistration,
  };

  const resultRegister = await authProcessRegister(context)(inputRegister, ioOutput());

  expect(resultRegister.status).toBe(200);

  const { logs, bearers, result: entities } = resultRegister.json;

  if (!entities) {
    expect(entities).toBeDefined();
    return;
  }

  const systemActive = systemSelectors.selectActive(context.store.getState());

  const users = entities[userKey] as Entity<User>[];
  const profiles = entities[profileKey] as Entity<Profile>[];
  const contacts = entities[contactKey] as Entity<Contact>[];
  const session = entities[sessionKey] as Entity<Session>[];

  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0].$roles).toEqual(systemActive?.$initialRoles);
  expect(users[0].$owner).toEqual(users[0].$id);
  expect(users[0].password).toBeDefined();

  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0].$owner).toEqual(users[0].$id);

  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0].$owner).toEqual(users[0].$id);

  expect(session).toBeDefined();
  expect(session).toHaveLength(1);
  expect(session[0].$owner).toEqual(users[0].$id);

  expect(logs).toHaveLength(2);
  expect(logs[0].level).toBe('success');
  expect(logs[0].title).toBe('Account Registered');
  expect(logs[1].level).toBe('success');
  expect(logs[1].title).toBe('Authentication Successful');

  if (!bearers) {
    expect(bearers).toBeDefined();
    return;
  }

  expect(bearers).toHaveLength(1);
  expect(bearers[0]).toMatchObject({
    id: 'core',
    exp: expect.any(Number),
    access: expect.any(String),
  });
});

test('should not be able to register when turned off by the system', async () => {
  const system = systemSelectors.selectActive(context.store.getState());

  if (!system) {
    expect(system).toBeDefined();
    return;
  }

  context.store.dispatch(systemActions.update({
    $id: system.$id,
    registrationOpen: false,
  }));

  const inputStart: IoInput = {
    body: {},
  };

  const resultStart = await authProcessChallenge(context)(
    inputStart,
    ioOutput(),
  ) as IoOutput<StateEntities>;

  const challenge = resultStart.json.result?.[challengeKey]?.[0] as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const [authRegistration] = await authRegistrationCreate({
    username: 'new_user',
    displayName: 'New User',
    password: 'passwd12',
    challenge,
  });

  const inputRegister: IoInput<AuthRegistration> = {
    body: authRegistration,
  };

  const resultRegister = await authProcessRegister(context)(inputRegister, ioOutput());

  expect(resultRegister.status).toBe(500);

  const { logs, result } = resultRegister.json;

  expect(result).toBeUndefined();
  expect(logs).toHaveLength(1);
  expect(logs[0].level).toBe('error');
  expect(logs[0].title).toBe('Registration Closed');
});
