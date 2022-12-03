import {
  databaseMemory,
  dataInitial,
  filesystemMemory,
  IoInput,
  ioProcess,
  schemaAuth,
  cryptoWeb,
  StateEntities,
  challengeKey,
  ioOutputErrored,
  AuthRegister,
  Challenge,
  Entity,
  credentialCreator,
  base64Encode,
  entityStrip,
  authRegisterCreate,
  IoOutput,
} from '@amnis/core';
import { storeSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { authProcessRegister } from './auth.register.js';

const io = ioProcess(
  {
    store: storeSetup(),
    validators: validateSetup([schemaAuth]),
    database: databaseMemory,
    filesystem: filesystemMemory,
    crypto: cryptoWeb,
  },
  {
    register: authProcessRegister,
  },
);

beforeAll(async () => {
  await databaseMemory.create(dataInitial());
});

test('should start the registration ritual', async () => {
  const input: IoInput = {
    body: undefined,
  };

  const output = await io.register(input);

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
    body: {},
  };

  const output = await io.register(input);

  expect(output.status).toBe(400);
  expect(ioOutputErrored(output)).toBe(true);
});

test('should start ritual and complete registration', async () => {
  const inputStart: IoInput = {
    body: undefined,
  };

  const resultStart = await io.register(inputStart) as IoOutput<StateEntities>;

  const challenge = resultStart.json.result?.[challengeKey]?.[0] as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const [authRegister] = await authRegisterCreate({
    agent: 'Jest Test Agent',
    username: 'new_user',
    password: 'passwd12',
    challenge,
  });

  const inputRegister: IoInput<AuthRegister> = {
    body: authRegister,
  };

  const resultRegister = await io.register(inputRegister);

  console.log(JSON.stringify(resultRegister, null, 2));
});
