import { entityCreate, User } from '@amnis/core/index';
import { passCreateSync } from '@amnis/auth/index';
import { memory } from '@amnis/db/memory';
import { storeSetup } from '@amnis/core/test/book.store';
import { apiAuthProcesses } from './auth.process';

/**
 * Setup the required application store.
 */
const appStore = storeSetup();

/**
 * Add a test user to the database.
 */
const users: User[] = [
  entityCreate('user', {
    name: 'ExampleUser',
    email: 'user.example@amnis.dev',
    password: passCreateSync('passwd1'),
    $roles: [],
    $permits: [],
  }),
];

/**
 * Create test data in the memory database.
 */
memory.create({
  user: users,
});

/**
 * Setup the processes
 */
const processes = apiAuthProcesses({
  store: appStore,
  database: memory,
});

/**
 * ============================================================
 */
test('auth should successfully login with valid credentials.', () => {
  const output = processes.login({
    body: {
      username: 'ExampleUser',
      password: 'passwd1',
    },
  });

  const user = output.json.result?.user[0];

  expect(user).toEqual(
    expect.objectContaining({
      $id: expect.any(String),
      email: expect.any(String),
      name: 'ExampleUser',
      password: '',
    }),
  );
});

/**
 * ============================================================
 */
test('auth should fail login with invalid credentials.', () => {
  const output = processes.login({
    body: {
      username: 'ExampleUser',
      password: 'passwd2',
    },
  });

  const user = output.json.result?.user[0];

  expect(output.json.errors).toHaveLength(1);
  expect(output.json.errors[0].title).toEqual('Bad Credentials');
  expect(user).toEqual(undefined);
});
