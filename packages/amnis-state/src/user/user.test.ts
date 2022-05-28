import { apiMockGenerateHandlers, apiMockServer } from '@amnis/core/api/api.mock';
import { coreActions } from '@amnis/core/actions';
import {
  apiRedux,
  apiBaseUrl,
  apiHandlersGenerate,
} from '@amnis/api/index';
import { memoryDb } from '@amnis/db-memory/index';
import {
  userInitialState,
  userSelectors,
  userKey,
} from './user';

import { userStoreSetup } from './user.store';

const mockHandlers = apiMockGenerateHandlers(
  apiBaseUrl,
  userStoreSetup,
  apiHandlersGenerate(),
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

  const action = coreActions.create({
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

  const action = coreActions.create({
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
    $id: expect.any(String),
    displayName: expect.any(String),
    $licenses: expect.any(Array),
  }));
});

/**
 * ============================================================
 */
test('should create user data through API', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    apiRedux.endpoints.dispatch.initiate({
      body: coreActions.create({
        [userKey]: [
          {
            displayName: 'eCrow',
          },
        ],
      }),
    }),
  );

  expect(action.status).toBe('fulfilled');

  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);
});

/**
 * ============================================================
 */
test('should select not user data through API with unmatching query', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    apiRedux.endpoints.select.initiate({
      body: {
        select: {
          user: {
            displayName: {
              $eq: 'not_eCrow',
            },
          },
        },
      },
    }),
  );

  expect(action.status).toBe('fulfilled');

  const result = action.data || {};

  expect(result.user).toHaveLength(0);
});

/**
 * ============================================================
 */
test('should select user data through API', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    apiRedux.endpoints.select.initiate({
      body: {
        select: {
          user: {
            displayName: {
              $eq: 'eCrow',
            },
          },
        },
      },
    }),
  );

  expect(action.status).toBe('fulfilled');

  const result = action.data || {};

  expect(result.user).toHaveLength(1);
});
