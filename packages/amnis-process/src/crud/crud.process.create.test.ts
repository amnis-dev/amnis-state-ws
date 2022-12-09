import {
  IoInput,
  ioProcess,
  schemaAuth,
  schemaEntity,
  StateCreator,
  Bearer,
  userCreator,
  userKey,
  ioOutputErrored,
  User,
  databaseMemoryStorage,
  Entity,
  IoContext,
  IoMap,
  schemaState,
  ioOutput,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { authenticateLogin } from '../utility/authenticate.js';
import { validateSetup } from '../validate.js';
import { crudProcessCreate } from './crud.process.create.js';

let context: IoContext;
let dataUsers: Entity<User>[];
let io: IoMap<'create'>;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth, schemaState, schemaEntity]),
  });
  const storage = databaseMemoryStorage();
  dataUsers = Object.values(storage[userKey]) as Entity<User>[];

  io = ioProcess(
    context,
    {
      create: crudProcessCreate,
    },
  );
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

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(401);
});

test('should login as administrator and create user', async () => {
  const outputLogin = await authenticateLogin(
    context,
    dataUsers.find((e) => e.name === 'admin') as Entity<User>,
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userNew = userCreator({
    name: 'Admin\'s New User',
  });

  const inputCreator: IoInput<StateCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [
        userNew,
      ],
    },
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
  expect(outputCreator.json.result?.user[0]?.committed).toBe(true);
  expect(ioOutputErrored(outputCreator)).toBe(false);

  const storage = databaseMemoryStorage();

  expect(Object.values(storage.user)).toHaveLength(4);
  expect((Object.values(storage.user)[3] as Entity<User>)?.name).toBe('Admin\'s New User');
});

test('should login as executive and create user', async () => {
  const outputLogin = await authenticateLogin(
    context,
    dataUsers.find((e) => e.name === 'exec') as Entity<User>,
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userNew = userCreator({
    name: 'Exec\'s New User',
  });

  const inputCreator: IoInput<StateCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [userNew],
    },
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
  expect(ioOutputErrored(outputCreator)).toBe(false);

  const storage = databaseMemoryStorage();

  expect(Object.values(storage.user)).toHaveLength(5);
  expect((Object.values(storage.user)[4] as Entity<User>)?.name).toBe('Exec\'s New User');
});

test('should login as user and cannot create user', async () => {
  const outputLogin = await authenticateLogin(
    context,
    dataUsers.find((e) => e.name === 'user') as Entity<User>,
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userNew = userCreator({
    name: 'User\'s New User',
  });

  const inputCreator: IoInput<StateCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [userNew],
    },
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
  expect(ioOutputErrored(outputCreator)).toBe(true);

  const storage = databaseMemoryStorage();

  expect(Object.values(storage.user)).toHaveLength(5);
});
