import coreSchema from '@amnis/core/core.schema.json';
import { coreActions, Session } from '@amnis/core/index';

import {
  apiAuth,
  apiAuthProcesses,
  apiAuthUrl,
  apiCrud,
  apiCrudProcesses,
  apiCrudUrl,
} from '@amnis/api/index';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock';

import {
  storeSetup,
  selectors,
  sessionKey,
  sessionSelectors,
  userKey,
  userSelectors,
} from '@amnis/state/index';

import stateSchema from '@amnis/state/state.schema.json';
import { databaseSetup } from './database';

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
 * Create the test database with pre-intantiated data.
 */
const database = databaseSetup();

/**
 * Fetch roles from the database and populate the server store.
 */
serverStore.dispatch(coreActions.create(database.read({
  role: {},
})));

/**
 * Setup the server processes for the Auth operations
 */
const authHandlers = apiAuthProcesses({
  store: serverStore,
  database,
});

/**
 * Setup the server processes for CRUD operations.
 */
const crudHanders = apiCrudProcesses({
  store: serverStore,
  database,
  schemas: [coreSchema, stateSchema],
  definitions: {
    create: 'state#/definitions/State',
    read: 'core#/definitions/Select',
    update: 'state#/definitions/StatePartial',
    delete: 'core#/definitions/Remove',
  },
});

/**
 * Mock the Auth API server for the tests.
 */
const mockAuthHandlers = apiMockGenerateHandlers(
  authHandlers,
  apiAuthUrl,
);

/**
 * Mock the CRUD API server for the tests.
 */
const mockCrudHandlers = apiMockGenerateHandlers(
  crudHanders,
  apiCrudUrl,
);

/**
 * Create a single mock service with the combined handlers.
 */
const mockServer = apiMockServer([...mockAuthHandlers, ...mockCrudHandlers]);

beforeAll(() => {
  mockServer.listen();
});
afterEach(() => {
  mockServer.resetHandlers();
});
afterAll(() => {
  mockServer.close();
});

test('should login as basic user named Normie', async () => {
  const action = await clientStore.dispatch(
    apiAuth.endpoints.login.initiate({
      username: 'Normie',
      password: 'passwd1',
    }),
  );

  expect(action.status).toBe('fulfilled');
});

test('client store should contain session.', async () => {
  const sessions = sessionSelectors.selectAll(clientStore.getState());

  expect(sessions).toHaveLength(1);

  const session = selectors.selectActive<Session>(clientStore.getState(), sessionKey);

  expect(session).not.toBeUndefined();
});

test('client store should contain own user data.', async () => {
  const users = userSelectors.selectAll(clientStore.getState());

  expect(users).toHaveLength(1);

  const user = selectors.selectActive<Session>(clientStore.getState(), userKey);

  expect(user).not.toBeUndefined();
});

/**
 * ============================================================
 */
test('should select OWNED user data through API as Normie', async () => {
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
});

/**
 * ============================================================
 */
test('should select NOT other user data as Normie', async () => {
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
