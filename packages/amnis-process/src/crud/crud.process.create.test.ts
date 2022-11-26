import {
  AuthLogin,
  dataInitial,
  IoInput,
  ioProcess,
  schemaAuth,
  schemaEntity,
  StateCreator,
  Bearer,
  userCreator,
  userKey,
  ioOutputErrored,
  coreActions,
  User,
  userBase,
  uid,
  stateEntitiesCreate,
  databaseMemory,
  filesystemMemory,
  databaseMemoryStorage,
  cryptoWeb,
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
    validators: validateSetup([schemaAuth, schemaEntity]),
    database: databaseMemory,
    filesystem: filesystemMemory,
    crypto: cryptoWeb,
  },
  {
    login: authProcessLogin,
    create: crudProcessCreate,
  },
);

beforeAll(async () => {
  const stateEntities = stateEntitiesCreate(data);
  store.dispatch(coreActions.insert(stateEntities));
  await databaseMemory.create(stateEntities);
});

test('should not create without bearer', async () => {
  const inputCreator: IoInput<StateCreator> = {
    body: {
      [userKey]: [
        userCreator({
          name: 'New User',
        }),
      ],
    },
  };

  const outputCreator = await io.create(inputCreator);

  expect(outputCreator.status).toBe(401);
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

  const userEntity = {
    ...userBase,
    $id: uid(userKey),
    name: 'Admin\'s New User',
  };

  // expect(userEntity.committed).toBe(false);

  const inputCreator: IoInput<StateCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [
        userEntity,
      ],
    },
  };

  const outputCreator = await io.create(inputCreator);

  expect(outputCreator.status).toBe(200);
  expect(outputCreator.json.result?.user[0]?.committed).toBe(true);
  expect(ioOutputErrored(outputCreator)).toBe(false);

  const storage = databaseMemoryStorage();

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

  const userNew = {
    ...userBase,
    $id: uid(userKey),
    name: 'Exec\'s New User',
  };

  const inputCreator: IoInput<StateCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [userNew],
    },
  };

  const outputCreator = await io.create(inputCreator);

  expect(outputCreator.status).toBe(200);
  expect(ioOutputErrored(outputCreator)).toBe(false);

  const storage = databaseMemoryStorage();

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

  const userNew = {
    ...userBase,
    $id: uid(userKey),
    name: 'User\'s New User',
  };

  const inputCreator: IoInput<StateCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [userNew],
    },
  };

  const outputCreator = await io.create(inputCreator);

  expect(outputCreator.status).toBe(200);
  expect(ioOutputErrored(outputCreator)).toBe(true);

  const storage = databaseMemoryStorage();

  expect(Object.values(storage.user)).toHaveLength(5);
});
