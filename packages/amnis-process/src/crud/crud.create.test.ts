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
import { authenticateFinalize } from '../utility/authenticate.js';
import { validateSetup } from '../validate.js';
import { processCrudCreate } from './crud.create.js';

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
      create: processCrudCreate,
    },
  );
});

test('should not create without bearer', async () => {
  const inputCreator: IoInput<StateCreator> = {
    body: {
      [userKey]: [
        userCreator({
          handle: 'NewUser',
        }),
      ],
    },
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(401);
});

test('should login as administrator and create user', async () => {
  const admin = dataUsers.find((e) => e.handle === 'admin') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    admin.$id,
    admin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userNew = userCreator({
    handle: 'NewUserByAdmin',
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
  expect((Object.values(storage.user)[3] as Entity<User>)?.handle).toBe('NewUserByAdmin');
});

test('should login as executive and create user', async () => {
  const exec = dataUsers.find((e) => e.handle === 'exec') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    exec.$id,
    exec.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userNew = userCreator({
    handle: 'NewUserByExec',
  });

  const inputCreator: IoInput<StateCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [userNew],
    },
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
  expect(outputCreator.json.logs.length).toBeGreaterThan(0);
  expect(ioOutputErrored(outputCreator)).toBe(false);

  const storage = databaseMemoryStorage();

  expect(Object.values(storage.user)).toHaveLength(5);
  expect((Object.values(storage.user)[4] as Entity<User>)?.handle).toBe('NewUserByExec');
});

test('should login as user and cannot create user', async () => {
  const user = dataUsers.find((e) => e.handle === 'user') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    user.$id,
    user.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const userNew = userCreator({
    handle: 'NewUserByUser',
  });

  const inputCreator: IoInput<StateCreator> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [userNew],
    },
  };

  const outputCreator = await io.create(inputCreator, ioOutput());

  expect(outputCreator.status).toBe(200);
  expect(outputCreator.json.logs.length).toBeGreaterThan(0);
  expect(ioOutputErrored(outputCreator)).toBe(true);

  const storage = databaseMemoryStorage();

  expect(Object.values(storage.user)).toHaveLength(5);
});
