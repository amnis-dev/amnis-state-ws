import { memory } from '@amnis/db';
import { storeSetup } from '@amnis/core/test/book.store.js';
import {
  ioProcess, IoInput, userCreate, profileCreate, sessionCreate, dateNumeric,
  schemaAuth,
} from '@amnis/core';
import { sessionEncode, passCreate } from '../crypto/index.js';
import { validateSetup } from '../validate.js';
import { authProcess } from './index.js';

/**
 * Setup the required application store.
 */
const appStore = storeSetup();

/**
 * Add a test user and profile to the database.
 */
const user = userCreate({
  name: 'ExampleUser',
  email: 'user.example@amnis.dev',
  password: passCreate('passwd1'),
});

const profile = profileCreate({
  nameDisplay: 'Example User',
  $user: user.$id,
});

/**
 * Create a test session.
 */
const session = sessionCreate({
  name: profile.nameDisplay,
  $subject: user.$id,
  exp: dateNumeric('1m'),
});

const sessionEncoded = sessionEncode(session);

/**
  * Create test data in the memory database.
  */
memory.create({
  user: [user],
  profile: [profile],
});

/**
 * Setup the io
 */
const io = ioProcess({
  store: appStore,
  database: memory,
  validators: validateSetup(schemaAuth),
}, authProcess);

test('Should be able to renew session and tokens', async () => {
  const input: IoInput = {
    sessionEncoded,
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
  expect(output.json.tokens).toHaveLength(1);
});

test('Should be able to renew session and tokens with user and profile information', async () => {
  const input: IoInput = {
    sessionEncoded,
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
  expect(output.json.tokens).toHaveLength(1);
});
