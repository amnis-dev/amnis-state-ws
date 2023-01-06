import {
  IoInput,
  schemaAuth,
  ioOutputErrored,
  ApiAuthRegistration,
  Challenge,
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
  accountsGenerateCrypto,
  base64JsonEncode,
  accountsSign,
} from '@amnis/core';
import { contextSetup, systemActions, systemSelectors } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { processAuthChallenge } from './auth.challenge.js';
import { processAuthRegister } from './auth.register.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should start the registration ritual', async () => {
  const input: IoInput = {
    body: {},
  };

  const output = await processAuthChallenge(context)(input, ioOutput());

  expect(output.status).toBe(200);

  if (!output.json.result) {
    expect(output.json.result).toBeDefined();
    return;
  }

  const credential = output.json.result;

  expect(credential).toBeDefined();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should not register with invalid body input', async () => {
  const input: IoInput = {
    body: { invalid: true },
  };

  const output = await processAuthRegister(context)(input, ioOutput());

  expect(output.status).toBe(400);
  expect(ioOutputErrored(output)).toBe(true);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should start ritual and complete registration', async () => {
  const inputStart: IoInput = {
    body: {},
  };

  const resultStart = await processAuthChallenge(context)(
    inputStart,
    ioOutput(),
  );
  const challenge = resultStart.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }
  const challengeEncoded = base64JsonEncode(challenge);

  const { credential, privateKey } = await accountsGenerateCrypto();

  const apiAuthRegistration: ApiAuthRegistration = {
    handle: 'new_user',
    nameDisplay: 'New User',
    password: 'passwd12',
    email: 'example@amnis.dev',
    credential,
  };

  const signatureEncoded = await accountsSign(privateKey, apiAuthRegistration);

  const inputRegister: IoInput<ApiAuthRegistration> = {
    body: apiAuthRegistration,
    challengeEncoded,
    signatureEncoded,
  };

  const resultRegister = await processAuthRegister(context)(inputRegister, ioOutput());

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
  expect(users[0].email).toBe('example@amnis.dev');

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
  expect(logs[0].title).toBe('Account Created');
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

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
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

  const resultStart = await processAuthChallenge(context)(
    inputStart,
    ioOutput(),
  );

  const challenge = resultStart.json.result as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }
  const challengeEncoded = base64JsonEncode(challenge);

  const { credential, privateKey } = await accountsGenerateCrypto();

  const apiAuthRegistration: ApiAuthRegistration = {
    handle: 'new_user',
    nameDisplay: 'New User',
    password: 'passwd12',
    email: 'example@amnis.dev',
    credential,
  };

  const signatureEncoded = await accountsSign(privateKey, apiAuthRegistration);

  const inputRegister: IoInput<ApiAuthRegistration> = {
    body: apiAuthRegistration,
    challengeEncoded,
    signatureEncoded,
  };

  const resultRegister = await processAuthRegister(context)(inputRegister, ioOutput());

  expect(resultRegister.status).toBe(500);

  const { logs, result } = resultRegister.json;

  expect(result).toBeUndefined();
  expect(logs).toHaveLength(1);
  expect(logs[0].level).toBe('error');
  expect(logs[0].title).toBe('Registration Closed');
});
