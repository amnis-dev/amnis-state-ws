import { memory } from '@amnis/db';
import {
  AuthLogin,
  AuthLogout,
  dataInitial,
  IoInput,
  ioProcess,
  schemaAuth,
  Session,
  sessionKey,
} from '@amnis/core';
import { storeSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { authProcessLogin } from './auth.login.js';
import { sessionEncode } from '../crypto/session.js';
import { authProcessLogout } from './auth.logout.js';

const io = ioProcess(
  {
    store: storeSetup(),
    validators: validateSetup([schemaAuth]),
    database: memory,
  },
  {
    login: authProcessLogin,
    logout: authProcessLogout,
  },
);

beforeAll(async () => {
  await memory.create(dataInitial());
});

test('should login and then logout as administrator', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'admin',
      password: 'passwd12',
    },
  };

  const outputLogin = await io.login(inputLogin);

  expect(outputLogin.status).toBe(200);
  expect(outputLogin.json.result?.[sessionKey]).toHaveLength(1);

  const session = outputLogin.json.result?.[sessionKey][0] as Session;

  const sessionEncoded = sessionEncode(session);

  const inputLogout: IoInput<AuthLogout> = {
    sessionEncoded,
    body: {},
  };

  const outputLogout = await io.logout(inputLogout);

  expect(outputLogout.status).toBe(200);
});

test('should not logout without an existing session', async () => {
  const inputLogout: IoInput<AuthLogout> = {
    body: {},
  };

  const outputLogout = await io.logout(inputLogout);

  expect(outputLogout.status).toBe(401);
});