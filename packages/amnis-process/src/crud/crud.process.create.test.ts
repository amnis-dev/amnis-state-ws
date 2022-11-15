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
  Bearer,
  userCreate,
  userKey,
  ioOutputErrored,
  coreActions,
  User,
} from '@amnis/core';
import { storeSetup } from '@amnis/state';
import { cryptoNode } from '@amnis/crypto';
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
    crypto: cryptoNode,
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

test('should not create without bearer', async () => {
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
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userEntity = userCreate({
    name: 'Admin\'s New User',
  });

  expect(userEntity.committed).toBe(false);

  const inputCreate: IoInput<StateCreate> = {
    accessEncoded: bearerAccess.access,
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
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const inputCreate: IoInput<StateCreate> = {
    accessEncoded: bearerAccess.access,
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
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const inputCreate: IoInput<StateCreate> = {
    accessEncoded: bearerAccess.access,
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
