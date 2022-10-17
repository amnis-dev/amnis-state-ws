import { passCreateSync } from '@amnis/auth/pass.js';
import { sessionEncode } from '@amnis/auth/session.js';
import { dateNumeric } from '@amnis/core/core.js';
import { profileCreate } from '@amnis/core/profile/index.js';
import { sessionCreate } from '@amnis/core/session/index.js';
import { storeSetup } from '@amnis/core/test/book.store.js';
import { userCreate } from '@amnis/core/user/index.js';
import { memory } from '@amnis/db/memory/index.js';
import { apiIO } from '../api.io.node.js';
import { ApiInput } from '../types.js';
import { validatorsSetup } from '../validators.js';
import { apiAuthProcess } from './auth.process.js';
import schemaAuth from './auth.schema.json';

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
  validators: validatorsSetup(schemaAuth),
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
