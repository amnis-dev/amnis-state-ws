/* eslint-disable @typescript-eslint/no-explicit-any */
import coreSchema from '@amnis/core/core.schema.json';
import { coreActions } from '@amnis/core/actions.js';
import { samples } from '@amnis/core/test/samples.js';

import { apiAuth } from '@amnis/api/auth/auth.api.node.js';
import { apiAuthProcess } from '@amnis/api/auth/auth.process.js';
import { apiCrud } from '@amnis/api/crud/crud.api.node.js';
import { apiCrudProcess } from '@amnis/api/crud/crud.process.js';
import { apiConfig } from '@amnis/api/config.js';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock.js';
import { validatorsSetup } from '@amnis/api/validators.js';
import { apiIO } from '@amnis/api/api.io.node.js';
import schemaAuth from '@amnis/api/auth/auth.schema.json';

import { storeSetup } from '@amnis/state/env.node/store.js';

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
} from '@amnis/state/index.js';

import stateSchema from '@amnis/state/state.schema.json';
import { passCreateSync } from '@amnis/process';
import { memory } from '@amnis/db/memory/index.js';
import { uidList } from '@amnis/core';
import { serviceSetup } from './database.js';

/**
 * Utility functions
 */

function expectDenied(action: any, key: string, errorTitle: string) {
  expect(action.status).toBe('fulfilled');

  const { data } = action;

  const entities = data?.result[key];

  expect(entities).not.toBeDefined();

  expect(data?.logs).toHaveLength(1);
  expect(data?.logs[0].title).toEqual(errorTitle);
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
 * Configure the validation methods.
 */
const validators = validatorsSetup([coreSchema, schemaAuth, stateSchema]);

/**
  * Setup the server processes for the Auth operations
  */
const authHandlers = apiIO({
  store: serverStore,
  database: memory,
  validators,
}, apiAuthProcess);

/**
  * Setup the server processes for CRUD operations.
  */
const crudHanders = apiIO({
  store: serverStore,
  database: memory,
  validators,
}, apiCrudProcess);

/**
  * Mock the Auth API server for the tests.
  */
const mockAuthHandlers = apiMockGenerateHandlers(
  authHandlers,
  apiConfig.API_AUTH_URL,
);

/**
  * Mock the CRUD API server for the tests.
  */
const mockCrudHandlers = apiMockGenerateHandlers(
  crudHanders,
  apiConfig.API_CRUD_URL,
);

/**
  * Create a single mock service with the combined handlers.
  */
const mockServer = apiMockServer([...mockAuthHandlers, ...mockCrudHandlers]);

beforeAll(async () => {
  /**
    * Create the test database with pre-intantiated data.
    */
  await serviceSetup(serverStore, memory);

  /**
    * Fetch roles from the database and populate the server store.
    */
  serverStore.dispatch(coreActions.create(await memory.read({
    role: {},
  }, { scope: { role: 'global' } })));

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
test('should login as semi-privileged user named Moddie', async () => {
  const action = await clientStore.dispatch(
    apiAuth.endpoints.login.initiate({
      username: 'Moddie',
      password: 'passwd2',
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
test('user create global should be -DENIED- as Moddie via API', async () => {
  const action = await clientStore.dispatch(
    apiCrud.endpoints.create.initiate({
      [userKey]: [
        userCreate({
          name: 'Newbie',
          email: 'newbie@ecrow.dev',
          password: passCreateSync('passwd0'),
        }),
      ],
    }),
  );

  expectDenied(action, userKey, 'Creations Disallowed');
});

/**
 * ============================================================
 */
test('user read owned should be +ALLOWED+ as Moddie via API', async () => {
  const action = await clientStore.dispatch(
    apiCrud.endpoints.read.initiate({
      user: {
        $query: {
          name: {
            $eq: 'Moddie',
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
test('user read global should be +ALLOWED+ as Moddie via API', async () => {
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
test('user update owned should be +ALLOWED+ as Moddie via API', async () => {
  const userActive = selectors.selectActive(clientStore.getState(), userKey);

  expect(userActive).toBeTruthy();

  if (!userActive) {
    return;
  }

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

  const { data } = action;
  const users = data?.result?.user as User[];

  expect(users).toBeDefined();

  expect(data?.result?.user).toHaveLength(1);
  expect(data?.logs).toHaveLength(0);
});

/**
 * ============================================================
 */
test('user update global should be -DENIED- as Moddie via API', async () => {
  const userMod = samples.users[2];
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
test('user delete owned should be -DENIED- as Moddie via API', async () => {
  const userMod = samples.users[1];
  const action = await clientStore.dispatch(
    apiCrud.endpoints.delete.initiate({
      user: uidList([userMod.$id]),
    }),
  );

  expectDenied(action, userKey, 'Deletes Disallowed');
});
