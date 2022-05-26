import { apiMockGenerateHandlers, apiMockServer } from '@amnis/core/api/api.mock';
import { entityActions } from '@amnis/core/entity';
import { stateApiBaseUrl, stateApiHandlersGenerate } from '@amnis/query/stateApi';
import {
  stateApi,
} from '@amnis/query/stateApi/stateApi.node';
import { AnyAction } from '@reduxjs/toolkit';
import { memoryDb } from '@amnis/db-memory/index';
import {
  userInitialState,
  userSelectors,
  userKey,
} from './user';

import { userStoreSetup } from './user.store';

const mockHandlers = apiMockGenerateHandlers(
  stateApiBaseUrl,
  userStoreSetup,
  stateApiHandlersGenerate(),
  memoryDb,
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

  const action = entityActions.create({
    [`not_${userKey}`]: [
      {
        displayName: 'eCrow',
        $licenses: [],
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

  const action = entityActions.create({
    [userKey]: [
      {
        displayName: 'eCrow',
        $licenses: [],
      },
    ],
  });

  store.dispatch(action);
  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    id: expect.any(String),
    displayName: expect.any(String),
  }));
});

/**
 * ============================================================
 */
test('should create user data through API', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    stateApi.endpoints.dispatch.initiate({
      body: entityActions.create({
        [userKey]: [
          {
            displayName: 'eCrow',
          },
        ],
      }),
    }),
  );

  expect(action.status).toBe('fulfilled');

  const data = action.data as AnyAction;

  store.dispatch(data);

  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);
});

/**
 * ============================================================
 */
test('should select user data through API', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    stateApi.endpoints.select.initiate({
      body: {
        slice: userKey,
        query: {
          displayName: {
            $eq: 'eCrow',
          },
        },
      },
    }),
  );

  expect(action.status).toBe('fulfilled');

  const { result } = action.data || {};

  expect(result).toHaveLength(1);
});
