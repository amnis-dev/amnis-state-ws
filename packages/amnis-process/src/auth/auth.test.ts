import {
  dateNumeric,
  ioProcess,
  Profile,
  profileCreator,
  Session,
  Bearer,
  bearerCreate,
  uid,
  User,
  userCreator,
  schemaAuth,
  stateEntitiesCreate,
} from '@amnis/core';
import { dbmemory } from '@amnis/db';
import { fsmemory } from '@amnis/fs';
import { storeSetup } from '@amnis/core/test/book.store.js';
import { cryptoWeb } from '@amnis/crypto';
import { authProcess } from './index.js';
import { validateSetup } from '../validate.js';

/**
 * Setup the required application store.
 */
const appStore = storeSetup();

beforeAll(async () => {
/**
 * Add a test user and profile to the database.
 */
  const users = [
    userCreator({
      name: 'ExampleUser',
      email: 'user.example@amnis.dev',
      password: await cryptoWeb.passHash('passwd1'),
    }),
  ];

  const profiles = [
    profileCreator({
      nameDisplay: 'Example User',
      $user: users[0].$id,
    }),
  ];

  /**
 * Create test data in the memory database.
 */
  dbmemory.create(stateEntitiesCreate({
    user: users,
    profile: profiles,
  }));
});

/**
 * Setup the processes
 */
const processes = ioProcess({
  store: appStore,
  database: dbmemory,
  filesystem: fsmemory,
  crypto: cryptoWeb,
  validators: validateSetup(schemaAuth),
}, authProcess);

/**
 * ============================================================
 */
test('auth should successfully login with valid credentials.', async () => {
  const output = await processes.login({
    body: {
      username: 'ExampleUser',
      password: 'passwd1',
    },
  });

  // const bearer = output.json.result?.bearer[0] as Profile;

  expect(output.json.result).toEqual({
    user: expect.any(Array),
    session: expect.any(Array),
    profile: expect.any(Array),
    contact: expect.any(Array),
  });

  expect(output.json.bearers?.length).toBeGreaterThan(0);

  const user = output.json.result?.user[0] as User;
  const session = output.json.result?.session[0] as Session;
  const profile = output.json.result?.profile[0] as Profile;
  const bearer = output.json.bearers?.[0] as Bearer;

  expect(user).toEqual(
    expect.objectContaining({
      $id: expect.any(String),
      email: expect.any(String),
      name: 'ExampleUser',
    }),
  );

  expect(session).toEqual(
    expect.objectContaining({
      $subject: user?.$id,
      name: profile?.nameDisplay,
    }),
  );

  expect(profile).toEqual(
    expect.objectContaining({
      $user: user?.$id,
      nameDisplay: expect.any(String),
    }),
  );

  expect(bearer).toEqual(
    expect.objectContaining({
      id: 'core',
      exp: expect.any(Number),
      access: expect.any(String),
    }),
  );
});

/**
 * ============================================================
 */
test('auth should fail login with invalid credentials.', async () => {
  const output = await processes.login({
    body: {
      username: 'ExampleUser',
      password: 'passwd2',
    },
  });

  const user = output.json.result?.user[0];

  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].title).toEqual('Bad Credentials');
  expect(user).toEqual(undefined);
});

/**
 * ============================================================
 */
test('auth should verify valid bearer.', async () => {
  const accessEncoded = await cryptoWeb.accessEncode({
    iss: 'core',
    sub: uid('user'),
    exp: dateNumeric('30m'),
    typ: 'access',
    adm: true,
    roles: [],
  });

  const bearer = bearerCreate({
    id: 'core',
    exp: dateNumeric('30m'),
    access: accessEncoded,
  });

  const output = await processes.verify({
    body: bearer,
  });

  expect(output.json.result).toEqual(true);
  expect(output.json.logs).toHaveLength(0);
});

/**
 * ============================================================
 */
test('auth should not verify an invalid bearer.', async () => {
  const asymKeyPairAnother = await cryptoWeb.asymGenerate('signer');

  const jwtEncodedInvalid = await cryptoWeb.accessEncode({
    iss: 'core',
    sub: uid('user'),
    exp: dateNumeric('30m'),
    typ: 'access',
    adm: true,
    roles: [],
  }, asymKeyPairAnother.privateKey);

  const bearer = bearerCreate({
    id: 'core',
    exp: dateNumeric('30m'),
    access: jwtEncodedInvalid,
  });

  const output = await processes.verify({
    body: bearer,
  });

  expect(output.json.result).toEqual(false);
  expect(output.json.logs).toHaveLength(1);
});
