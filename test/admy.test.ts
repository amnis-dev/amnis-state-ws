import { coreActions } from '@amnis/core/actions';
import { samples } from '@amnis/core/test/samples';

import { apiAuth } from '@amnis/api/auth/auth.api.node';
import { apiCrud } from '@amnis/api/crud/crud.api.node';

import { storeSetup } from '@amnis/state/env.node/store';

import {
  selectors,
  Session,
  sessionKey,
  sessionSelectors,
  User,
  userSelectors,
  userKey,
  Profile,
  profileSelectors,
  profileKey,
  userCreate,
} from '@amnis/state/index';

import { passCreateSync } from '@amnis/auth/pass';
import { memory } from '@amnis/db/memory';
import { databaseSetup } from './database';
import { apiSetup } from './api';

/**
 * Create the server store.
 * The server store contains a cache of roles and tokens needed by the server.
 */
const serverStore = storeSetup();

/**
 * Create the client store.
 * This is a simulation of data that will be stored into the client state.
 */
const clientStore = storeSetup();

/**
 * Create a single mock service with the combined handlers.
 */
const mockServer = apiSetup(serverStore);

beforeAll(async () => {
  /**
   * Create the test database with pre-intantiated data.
   */
  await databaseSetup(memory);

  /**
   * Fetch roles from the database and populate the server store.
   */
  serverStore.dispatch(coreActions.create(await memory.read({
    role: {},
  }, { role: 'global' })));

  mockServer.listen();
});
afterEach(() => {
  mockServer.resetHandlers();
});
afterAll(() => {
  mockServer.close();
});

/**
 * ============================================================
 */
test('should login as most-privileged user named Admy', async () => {
  const action = await clientStore.dispatch(
    apiAuth.endpoints.login.initiate({
      username: 'Admy',
      password: 'passwd3',
    }),
  );

  expect(action.status).toBe('fulfilled');
});

/**
 * ============================================================
 */
test('client store should contain session.', async () => {
  const sessions = sessionSelectors.selectAll(clientStore.getState());

  expect(sessions).toHaveLength(1);

  const session = selectors.selectActive<Session>(clientStore.getState(), sessionKey);

  expect(session).not.toBeUndefined();
});

/**
 * ============================================================
 */
test('client store should contain own user data.', async () => {
  const users = userSelectors.selectAll(clientStore.getState());

  expect(users).toHaveLength(1);

  const user = selectors.selectActive<User>(clientStore.getState(), userKey);

  expect(user).not.toBeUndefined();
});

/**
 * ============================================================
 */
test('client store should contain own profile data.', async () => {
  const profiles = profileSelectors.selectAll(clientStore.getState());

  expect(profiles).toHaveLength(1);

  const profile = selectors.selectActive<Profile>(clientStore.getState(), profileKey);

  expect(profile).not.toBeUndefined();

  expect(profile).toEqual(
    expect.objectContaining({
      $user: expect.any(String),
      nameDisplay: expect.any(String),
    }),
  );
});

/**
 * ============================================================
 */
test('user create global should be +ALLOWED+ as Admy via API', async () => {
  const action = await clientStore.dispatch(
    apiCrud.endpoints.create.initiate({
      user: [
        userCreate({
          name: 'Newbie',
          email: 'newbie@ecrow.dev',
          password: passCreateSync('passwd0'),
        })[0],
      ],
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;

  expect(data?.result?.user).toHaveLength(1);
  expect(data?.logs).toHaveLength(0);
});

/**
 * ============================================================
 */
test('user read owned should be +ALLOWED+ as Admy via API', async () => {
  const action = await clientStore.dispatch(
    apiCrud.endpoints.read.initiate({
      user: {
        $query: {
          name: {
            $eq: 'Admy',
          },
        },
      },
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;

  expect(data?.result?.user).toHaveLength(1);
  expect(data?.logs).toHaveLength(0);
});

/**
 * ============================================================
 */
test('user read global should be +ALLOWED+ as Admy via API', async () => {
  const action = await clientStore.dispatch(
    apiCrud.endpoints.read.initiate({
      user: {
        $query: {
          name: {
            $eq: 'Admy',
          },
        },
      },
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;

  expect(data?.result?.user).toHaveLength(1);
  expect(data?.logs).toHaveLength(0);
});

/**
 * ============================================================
 */
test('user update owned should be +ALLOWED+ as Admy via API', async () => {
  const userActive = selectors.selectActive(clientStore.getState(), userKey);

  const action = await clientStore.dispatch(
    apiCrud.endpoints.update.initiate({
      user: [
        {
          $id: userActive?.$id,
          email: 'something.else@amnis.dev',
        },
      ],
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;
  const users = data?.result?.user as User[];

  expect(users).toBeDefined();

  expect(data?.result?.user).toHaveLength(1);
  expect(data?.logs).toHaveLength(0);
});

/**
 * ============================================================
 */
test('user update global should be +ALLOWED+ as Admy via API', async () => {
  const userMod = samples.users[1];
  const action = await clientStore.dispatch(
    apiCrud.endpoints.update.initiate({
      user: [
        {
          $id: userMod.$id,
          email: 'something.else@amnis.dev',
        },
      ],
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;
  const users = data?.result?.user as User[];

  expect(users).toBeDefined();

  expect(data?.result?.user).toHaveLength(1);
  expect(data?.logs).toHaveLength(0);
});

/**
 * ============================================================
 */
test('user delete owned should be +ALLOWED+ as Admy via API', async () => {
  const userMod = samples.users[1];
  const action = await clientStore.dispatch(
    apiCrud.endpoints.delete.initiate({
      user: [userMod.$id],
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;
  const userIds = data?.result?.user as string[];

  expect(userIds).toBeDefined();

  expect(userIds).toHaveLength(1);
  expect(data?.logs).toHaveLength(0);
});
