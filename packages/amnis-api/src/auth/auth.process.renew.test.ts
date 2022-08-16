import { passCreateSync } from '@amnis/auth/pass';
import { sessionEncode } from '@amnis/auth/session';
import { dateNumeric } from '@amnis/core/core';
import { profileCreate } from '@amnis/core/profile';
import { sessionCreate } from '@amnis/core/session';
import { storeSetup } from '@amnis/core/test/book.store';
import { userCreate } from '@amnis/core/user';
import { memory } from '@amnis/db/memory';
import { apiIO } from '../api.io.node';
import { ApiInput } from '../types';
import { validatorsSetup } from '../validators';
import { apiAuthProcess } from './auth.process';
import authSchema from './auth.schema.json';

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
  password: passCreateSync('passwd1'),
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
const io = apiIO({
  store: appStore,
  database: memory,
  validators: validatorsSetup(authSchema),
}, apiAuthProcess);

test('Should be able to renew session and tokens', async () => {
  const input: ApiInput = {
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
  const input: ApiInput = {
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
