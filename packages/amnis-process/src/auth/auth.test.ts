import {
  dateNumeric,
  ioProcess,
  Profile,
  profileCreate,
  Session,
  Token,
  tokenCreate,
  uid,
  User,
  userCreate,
  schemaAuth,
} from '@amnis/core';
import { memory } from '@amnis/db';
import { fsmemory } from '@amnis/fs';
import { storeSetup } from '@amnis/core/test/book.store.js';
import { generateRsa, jwtEncode, passCreate } from '../crypto/index.js';
import { authProcess } from './index.js';
import { validateSetup } from '../validate.js';

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
    password: passCreate('passwd1'),
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
  sub: uid('user'),
  exp: dateNumeric('30m'),
  typ: 'access',
  adm: true,
  roles: [],
});

const rsaKeyPairAnother = generateRsa();

const jwtEncodedInvalid = jwtEncode({
  iss: 'core',
  sub: uid('user'),
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
const processes = ioProcess({
  store: appStore,
  database: memory,
  filesystem: fsmemory,
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
