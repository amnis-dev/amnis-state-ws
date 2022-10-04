import { dateNumeric, identifier } from '@amnis/core/core';
import { userCreate, User } from '@amnis/core/user';
import type { Session } from '@amnis/core/session';
import { Profile, profileCreate } from '@amnis/core/profile';
import { passCreateSync } from '@amnis/auth/pass';
import { memory } from '@amnis/db/memory';
import { storeSetup } from '@amnis/core/test/book.store';
import { Token, tokenCreate } from '@amnis/core/token';
import { jwtEncode } from '@amnis/auth/token';
import { generateRsa } from '@amnis/auth/rsa';
import { apiAuthProcess } from './auth.process';
import { apiIO } from '../api.io.node';
import { validatorsSetup } from '../validators';
import schemaAuth from './auth.schema.json';

/**
 * Setup the required application store.
 */
const appStore = storeSetup();

/**
 * Add a test user and profile to the database.
 */
const users: User[] = [
  userCreate({
    name: 'ExampleUser',
    email: 'user.example@amnis.dev',
    password: passCreateSync('passwd1'),
  }),
];

const profiles: Profile[] = [
  profileCreate({
    nameDisplay: 'Example User',
    $user: users[0].$id,
  }),
];

const jwtTokenRegex = /^(?:[\w-]*\.){2}[\w-]*$/;

/**
 * Create a JWT token in order to execute processes.
 */
const jwtEncoded = jwtEncode({
  iss: 'core',
  sub: identifier('user'),
  exp: dateNumeric('30m'),
  typ: 'access',
  adm: true,
  roles: [],
});

const rsaKeyPairAnother = generateRsa();

const jwtEncodedInvalid = jwtEncode({
  iss: 'core',
  sub: identifier('user'),
  exp: dateNumeric('30m'),
  typ: 'access',
  adm: true,
  roles: [],
}, rsaKeyPairAnother.privateKey);

/**
 * Create test data in the memory database.
 */
memory.create({
  user: users,
  profile: profiles,
});

/**
 * Setup the processes
 */
const processes = apiIO({
  store: appStore,
  database: memory,
  validators: validatorsSetup(schemaAuth),
}, apiAuthProcess);

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

  // const token = output.json.result?.token[0] as Profile;

  expect(output.json.result).toEqual({
    user: expect.any(Array),
    session: expect.any(Array),
    profile: expect.any(Array),
  });

  expect(output.json.tokens?.length).toBeGreaterThan(0);

  const user = output.json.result?.user[0] as User;
  const session = output.json.result?.session[0] as Session;
  const profile = output.json.result?.profile[0] as Profile;
  const token = output.json.tokens?.[0] as Token;

  expect(user).toEqual(
    expect.objectContaining({
      $id: expect.any(String),
      email: expect.any(String),
      name: 'ExampleUser',
      password: null,
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

  expect(token).toEqual(
    expect.objectContaining({
      api: 'core',
      type: 'access',
    }),
  );

  expect(output.cookies?.authSession).toMatch(jwtTokenRegex);
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
test('auth should verify valid token.', async () => {
  const token = tokenCreate({
    api: 'core',
    type: 'access',
    exp: dateNumeric('30m'),
    jwt: jwtEncoded,
  });

  const output = await processes.verify({
    body: token,
  });

  expect(output.json.result).toEqual(true);
  expect(output.json.logs).toHaveLength(0);
});

/**
 * ============================================================
 */
test('auth should not verify an invalid token.', async () => {
  const token = tokenCreate({
    api: 'core',
    type: 'access',
    exp: dateNumeric('30m'),
    jwt: jwtEncodedInvalid,
  });

  const output = await processes.verify({
    body: token,
  });

  expect(output.json.result).toEqual(false);
  expect(output.json.logs).toHaveLength(0);
});
