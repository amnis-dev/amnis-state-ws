import { dbmemory, memoryStorage } from '@amnis/db';
import { fsmemory } from '@amnis/fs';
import {
  AuthLogin,
  dataInitial,
  IoInput,
  ioProcess,
  schemaAuth,
  schemaState,
  schemaEntity,
  StateCreate,
  Token,
  userCreate,
  userKey,
  ioOutputErrored,
  coreActions,
  User,
} from '@amnis/core';
import { storeSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { authProcessLogin } from '../auth/auth.login.js';
import { crudProcessCreate } from './crud.process.create.js';

const data = dataInitial();
const store = storeSetup();

const io = ioProcess(
  {
    store,
    validators: validateSetup([schemaAuth, schemaState, schemaEntity]),
    database: dbmemory,
    filesystem: fsmemory,
  },
  {
    login: authProcessLogin,
    create: crudProcessCreate,
  },
);

beforeAll(async () => {
  store.dispatch(coreActions.create(data));
  await dbmemory.create(data);
});

test('should not create without token', async () => {
  const inputCreate: IoInput<StateCreate> = {
    body: {
      [userKey]: [
        userCreate({
          name: 'New User',
        }),
      ],
    },
  };

  const outputCreate = await io.create(inputCreate);

  expect(outputCreate.status).toBe(401);
});

test('should login as administrator and create user', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'admin',
      password: 'passwd12',
    },
  };

  const outputLogin = await io.login(inputLogin);
  const tokenAccess = outputLogin.json.tokens?.[0] as Token;

  const userEntity = userCreate({
    name: 'Admin\'s New User',
  });

  expect(userEntity.committed).toBe(false);

  const inputCreate: IoInput<StateCreate> = {
    jwtEncoded: tokenAccess.jwt,
    body: {
      [userKey]: [
        userEntity,
      ],
    },
  };

  const outputCreate = await io.create(inputCreate);

  expect(outputCreate.status).toBe(200);
  expect(outputCreate.json.result?.user[0]?.committed).toBe(true);
  expect(ioOutputErrored(outputCreate)).toBe(false);

  const storage = memoryStorage();

  expect(Object.values(storage.user)).toHaveLength(4);
  expect((Object.values(storage.user)[3] as User)?.name).toBe('Admin\'s New User');
});

test('should login as executive and create user', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'exec',
      password: 'passwd12',
    },
  };

  const outputLogin = await io.login(inputLogin);
  const tokenAccess = outputLogin.json.tokens?.[0] as Token;

  const inputCreate: IoInput<StateCreate> = {
    jwtEncoded: tokenAccess.jwt,
    body: {
      [userKey]: [
        userCreate({
          name: 'Exec\'s New User',
        }),
      ],
    },
  };

  const outputCreate = await io.create(inputCreate);

  expect(outputCreate.status).toBe(200);
  expect(ioOutputErrored(outputCreate)).toBe(false);

  const storage = memoryStorage();

  expect(Object.values(storage.user)).toHaveLength(5);
  expect((Object.values(storage.user)[4] as User)?.name).toBe('Exec\'s New User');
});

test('should login as user and cannot create user', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'user',
      password: 'passwd12',
    },
  };

  const outputLogin = await io.login(inputLogin);
  const tokenAccess = outputLogin.json.tokens?.[0] as Token;

  const inputCreate: IoInput<StateCreate> = {
    jwtEncoded: tokenAccess.jwt,
    body: {
      [userKey]: [
        userCreate({
          name: 'User\'s New User',
        }),
      ],
    },
  };

  const outputCreate = await io.create(inputCreate);

  expect(outputCreate.status).toBe(200);
  expect(ioOutputErrored(outputCreate)).toBe(true);

  const storage = memoryStorage();

  expect(Object.values(storage.user)).toHaveLength(5);
});
