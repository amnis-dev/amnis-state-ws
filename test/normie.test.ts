/* eslint-disable @typescript-eslint/no-explicit-any */
import coreSchema from '@amnis/core/core.schema.json';
import { coreActions } from '@amnis/core/index';
import { samples } from '@amnis/core/test/samples';

import {
  apiAuth,
  apiAuthProcesses,
  API_AUTH_URL,
  apiCrud,
  apiCrudProcesses,
  API_CRUD_URL,
} from '@amnis/api/index';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock';

import {
  storeSetup,
  selectors,
  sessionKey,
  sessionSelectors,
  Session,
  userKey,
  userSelectors,
  User,
  profileSelectors,
  Profile,
  profileKey,
} from '@amnis/state/index';

import stateSchema from '@amnis/state/state.schema.json';
import { passCreateSync } from '@amnis/auth/pass';
import { memory } from '@amnis/db/memory';
import { databaseSetup } from './database';

/**
 * Utility functions
 */

function expectDenied(action: any, key: string, errorTitle: string) {
  expect(action.status).toBe('fulfilled');

  const { data } = action;

  const entities = data?.result[key];

  expect(entities).not.toBeDefined();

  expect(data?.errors).toHaveLength(1);
  expect(data?.errors[0].title).toEqual(errorTitle);
}

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
  * Setup the server processes for the Auth operations
  */
const authHandlers = apiAuthProcesses({
  store: serverStore,
  database: memory,
});

/**
  * Setup the server processes for CRUD operations.
  */
const crudHanders = apiCrudProcesses({
  store: serverStore,
  database: memory,
  schemas: [coreSchema, stateSchema],
  definitions: {
    create: 'state#/definitions/StateCreate',
    read: 'core#/definitions/Select',
    update: 'state#/definitions/StateUpdate',
    delete: 'core#/definitions/Remove',
  },
});

/**
  * Mock the Auth API server for the tests.
  */
const mockAuthHandlers = apiMockGenerateHandlers(
  authHandlers,
  API_AUTH_URL,
);

/**
  * Mock the CRUD API server for the tests.
  */
const mockCrudHandlers = apiMockGenerateHandlers(
  crudHanders,
  API_CRUD_URL,
);

/**
  * Create a single mock service with the combined handlers.
  */
const mockServer = apiMockServer([...mockAuthHandlers, ...mockCrudHandlers]);

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
test('should login as least-privileged user named Normie', async () => {
  const action = await clientStore.dispatch(
    apiAuth.endpoints.login.initiate({
      username: 'Normie',
      password: 'passwd1',
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
test('user create global should be -DENIED- as Normie via API', async () => {
  const action = await clientStore.dispatch(
    apiCrud.endpoints.create.initiate({
      [userKey]: [
        {
          name: 'Newbie',
          email: 'newbie@ecrow.dev',
          password: passCreateSync('passwd0'),
          $roles: [],
        },
      ],
    }),
  );

  expectDenied(action, userKey, 'Creations Disallowed');
});

/**
 * ============================================================
 */
test('user read owned should be +ALLOWED+ as Normie via API', async () => {
  const action = await clientStore.dispatch(
    apiCrud.endpoints.read.initiate({
      user: {
        $query: {
          name: {
            $eq: 'Normie',
          },
        },
      },
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;

  expect(data?.result?.user).toHaveLength(1);
  expect(data?.errors).toHaveLength(0);
});

/**
 * ============================================================
 */
test('user read global should be -DENIED- as Normie via API', async () => {
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

  expect(data?.result?.user).toHaveLength(0);
});

/**
 * ============================================================
 */
test('user update owned should be -DENIED- as Normie via API', async () => {
  const userActive = selectors.selectActive(clientStore.getState(), userKey);

  const action = await clientStore.dispatch(
    apiCrud.endpoints.update.initiate({
      [userKey]: [
        {
          $id: userActive?.$id,
          email: 'something.else@amnis.dev',
        },
      ],
    }),
  );

  expectDenied(action, userKey, 'Updates Disallowed');
});

/**
 * ============================================================
 */
test('user update global should be -DENIED- as Normie via API', async () => {
  const userMod = samples.users[1];
  const action = await clientStore.dispatch(
    apiCrud.endpoints.update.initiate({
      [userKey]: [
        {
          $id: userMod.$id,
          email: 'something.else@amnis.dev',
        },
      ],
    }),
  );

  expectDenied(action, userKey, 'Updates Disallowed');
});

/**
 * ============================================================
 */
test('user delete owned should be -DENIED- as Normie via API', async () => {
  const userMod = samples.users[1];
  const action = await clientStore.dispatch(
    apiCrud.endpoints.delete.initiate({
      [userKey]: [userMod.$id],
    }),
  );

  expectDenied(action, userKey, 'Deletes Disallowed');
});

/**
 * ============================================================
 */
test('profile create global should be -DENIED- as Normie via API', async () => {
  const userActive = selectors.selectActive(clientStore.getState(), userKey);

  const action = await clientStore.dispatch(
    apiCrud.endpoints.create.initiate({
      [profileKey]: [
        {
          user: userActive?.$id,
          nameDisplay: 'MyNormieProfile',
        },
      ],
    }),
  );

  expectDenied(action, profileKey, 'Creations Disallowed');
});

/**
 * ============================================================
 */
test('profile update owned should be +ALLOWED+ as Normie via API', async () => {
  const profileActive = selectors.selectActive(clientStore.getState(), profileKey);

  const action = await clientStore.dispatch(
    apiCrud.endpoints.update.initiate({
      [profileKey]: [
        {
          $id: profileActive?.$id,
          nameDisplay: 'New Display Name',
        },
      ],
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;
  const profiles = data?.result?.profile;

  expect(profiles).toHaveLength(1);

  const profile = profiles && profiles[0] as Profile;

  expect(profile?.nameDisplay).toEqual('New Display Name');
});

/**
 * ============================================================
 */
test('profile update global should be -DENIED- as Normie via API', async () => {
  const action = await clientStore.dispatch(
    apiCrud.endpoints.update.initiate({
      [profileKey]: [
        {
          $id: samples.profiles[1].$id,
          nameDisplay: 'Another Display Name',
        },
      ],
    }),
  );

  expectDenied(action, profileKey, 'Updates Disallowed');
});
