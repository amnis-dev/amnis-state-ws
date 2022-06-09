import coreSchema from '@amnis/core/core.schema.json';
import { coreActions } from '@amnis/core/index';

import { apiCrud, apiCrudProcesses, apiCrudUrl } from '@amnis/api/index';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock';

import { storeSetup } from '@amnis/state/index';

import stateSchema from '@amnis/state/state.schema.json';

import { databaseSetup } from './database';

/**
 * Create the server store.
 * The server store contains a cache of roles and tokens needed by the server.
 */
const serverStore = storeSetup();

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
 * Setup the server processes for CRUD operations.
 */
const crudHanders = apiCrudProcesses({
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
 * Mock the API server for the tests.
 */
const mockHandlers = apiMockGenerateHandlers(
  serverStore,
  crudHanders,
  apiCrudUrl,
);
const mockServer = apiMockServer(mockHandlers);

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

// /**
//  * ============================================================
//  */
// test('should create user data through API', async () => {
//   const clientStore = storeSetup();

//   const action = await clientStore.dispatch(
//     apiCrud.endpoints.create.initiate({
//       [userKey]: [
//         entityCreate<User>(userKey, {
//           ...userDefault,
//         }),
//       ],
//     }),
//   );

//   expect(action.status).toBe('fulfilled');

//   const entities = userSelectors.selectAll(clientStore.getState());
//   expect(entities).toHaveLength(1);
// });

// /**
//  * ============================================================
//  */
// test('should not select user data with unmatching query through API', async () => {
//   const clientStore = storeSetup();

//   const action = await clientStore.dispatch(
//     apiCrud.endpoints.read.initiate({
//       user: {
//         displayName: {
//           $eq: 'not_eCrow',
//         },
//       },
//     }),
//   );

//   expect(action.status).toBe('fulfilled');

//   const { data } = action;

//   expect(data?.result?.user).toHaveLength(0);
// });

/**
 * ============================================================
 */
test('should select user data through API', async () => {
  const clientStore = storeSetup();

  const action = await clientStore.dispatch(
    apiCrud.endpoints.read.initiate({
      user: {
        name: {
          $eq: 'Admin_eCrow',
        },
      },
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;

  expect(data?.result?.user).toHaveLength(1);
});
