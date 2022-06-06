import { apiCrud, apiCrudProcesses } from '@amnis/api/index';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock';
import { coreActions } from '@amnis/core/actions';
import { memory } from '@amnis/db/index';
import {
  entityCreate, User,
} from '@amnis/core/index';
import coreSchema from '@amnis/core/core.schema.json';
import stateSchema from '../state.schema.json';
import {
  userInitialState,
  userSelectors,
  userKey,
} from './user';

import { userStoreSetup } from './user.store';
import { userDefault } from './user.default';

const mockHandlers = apiMockGenerateHandlers(
  apiCrudProcesses({
    storeSetup: userStoreSetup,
    database: memory,
    schemas: [coreSchema, stateSchema],
    definitions: {
      create: 'state#/definitions/State',
      read: 'core#/definitions/Select',
      update: 'state#/definitions/StatePartial',
      delete: 'core#/definitions/Remove',
    },
  }),
);
const mockServer = apiMockServer(mockHandlers);

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

/**
 * ============================================================
 */
test('user should return the initial state', () => {
  const store = userStoreSetup();

  expect(
    store.getState().user,
  ).toEqual(userInitialState);
});

/**
 * ============================================================
 */
test('should not generically create a new user with mismatched keys', () => {
  const store = userStoreSetup();

  const action = coreActions.create({
    [`not_${userKey}`]: [
      {
        displayName: 'eCrow',
        $roles: [],
      },
    ],
  });

  store.dispatch(action);
  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(0);
});

/**
 * ============================================================
 */
test('should handle generically creating a new user', () => {
  const store = userStoreSetup();

  const action = coreActions.create({
    [userKey]: [
      {
        displayName: 'eCrow',
        $roles: [],
      },
    ],
  });

  store.dispatch(action);
  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    $id: expect.any(String),
    displayName: expect.any(String),
    $roles: expect.any(Array),
  }));
});

/**
 * ============================================================
 */
test('should create user data through API', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    apiCrud.endpoints.create.initiate({
      [userKey]: [
        entityCreate<User>(userKey, {
          ...userDefault,
        }),
      ],
    }),
  );

  expect(action.status).toBe('fulfilled');

  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);
});

/**
 * ============================================================
 */
test('should not select user data with unmatching query through API', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    apiCrud.endpoints.read.initiate({
      user: {
        displayName: {
          $eq: 'not_eCrow',
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
test('should select user data through API', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    apiCrud.endpoints.read.initiate({
      user: {
        name: {
          $eq: 'eCrow',
        },
      },
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { data } = action;

  expect(data?.result?.user).toHaveLength(1);
});
