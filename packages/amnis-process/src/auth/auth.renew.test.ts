import { dbmemory } from '@amnis/db';
import { fsmemory } from '@amnis/fs';
import { storeSetup } from '@amnis/core/test/book.store.js';
import {
  ioProcess, IoInput, userCreator, profileCreator,
  schemaAuth,
  CryptoEncoded,
  AuthLogin,
  stateEntitiesCreate,
} from '@amnis/core';
import { cryptoWeb } from '@amnis/crypto';
import { validateSetup } from '../validate.js';
import { authProcess } from './index.js';

/**
 * Setup the required application store.
 */
const appStore = storeSetup();

beforeAll(async () => {
  /**
 * Add a test user and profile to the database.
 */
  const user = userCreator({
    name: 'ExampleUser',
    email: 'user.example@amnis.dev',
    password: await cryptoWeb.passHash('passwd1'),
  });

  const profile = profileCreator({
    nameDisplay: 'Example User',
    $user: user.$id,
  });

  /**
  * Create test data in the memory database.
  */
  dbmemory.create(stateEntitiesCreate({
    user: [user],
    profile: [profile],
  }));
});

/**
 * Setup the io
 */
const io = ioProcess({
  store: appStore,
  database: dbmemory,
  validators: validateSetup(schemaAuth),
  filesystem: fsmemory,
  crypto: cryptoWeb,
}, authProcess);

test('Should be able to renew session and bearers', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'ExampleUser',
      password: 'passwd1',
    },
  };

  const outputLogin = await io.login(inputLogin);

  const input: IoInput = {
    sessionEncoded: outputLogin.cookies?.authSession as CryptoEncoded,
    body: {},
  };

  const output = await io.renew(input);

  /**
   * Should see the new session cookie in the output.
   */
  expect(output.cookies.authSession).toBeDefined();

  expect(output.json.result).toBeDefined();
  expect(Object.keys(output.json.result || {})).toHaveLength(1);
  expect(output.json.result?.session).toHaveLength(1);
  expect(output.json.bearers).toHaveLength(1);
});

test('Should be able to renew session and bearers with user and profile information', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'ExampleUser',
      password: 'passwd1',
    },
  };

  const outputLogin = await io.login(inputLogin);

  const input: IoInput = {
    sessionEncoded: outputLogin.cookies?.authSession as CryptoEncoded,
    body: {
      info: true,
    },
  };

  const output = await io.renew(input);

  /**
   * Should see the new session cookie in the output.
   */
  expect(output.cookies.authSession).toBeDefined();

  expect(output.json.result).toBeDefined();
  expect(output.json.result?.session).toHaveLength(1);
  expect(output.json.result?.user).toHaveLength(1);
  expect(output.json.result?.profile).toHaveLength(1);
  expect(output.json.bearers).toHaveLength(1);
});
