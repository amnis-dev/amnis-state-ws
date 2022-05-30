import { coreActions } from '@amnis/core/actions';
import {
  apiCrud,
  apiCrudHandlersGenerate,
} from '@amnis/api/index';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock';
import { memory } from '@amnis/db/index';
import {
  userInitialState,
  userSelectors,
  userKey,
} from './user';

import { userStoreSetup } from './user.store';

const mockHandlers = apiMockGenerateHandlers(
  userStoreSetup,
  apiCrudHandlersGenerate(),
  memory,
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
    apiCrud.endpoints.create.initiate({
      [userKey]: [
        {
          displayName: 'eCrow',
        },
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

  const result = action.data || {};

  expect(result.user).toHaveLength(0);
});

/**
 * ============================================================
 */
test('should select user data through API', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    apiCrud.endpoints.read.initiate({
      user: {
        displayName: {
          $eq: 'eCrow',
        },
      },
    }),
  );

  expect(action.status).toBe('fulfilled');

  const result = action.data || {};

  expect(result.user).toHaveLength(1);
});
