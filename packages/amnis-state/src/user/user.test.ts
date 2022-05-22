import type {
  EntityCreate,
} from '@amnis/core/entity';
import {
  entityApi,
} from '@amnis/query/entityApi/entityApi.node';
import {
  userInitialState,
  userActions,
  userSelectors,
} from './user';
import type {
  User,
} from './user.types';

import { userStoreSetup } from './user.store';
import { userMockServer } from './user.mock';

beforeAll(() => userMockServer.listen());
afterEach(() => userMockServer.resetHandlers());
afterAll(() => userMockServer.close());

/**
 * ============================================================
 */
test('user should return the initial state', () => {
  const store = userStoreSetup();

  expect(
    store.getState()['@amnis/user'],
  ).toEqual(userInitialState);
});

/**
 * ============================================================
 */
test('should handle the creation of a new user', () => {
  const store = userStoreSetup();

  const payload: EntityCreate<User> = {
    displayName: 'eCrow',
  };

  store.dispatch(userActions.create(payload));

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
test('should handle setting active entity', () => {
  const store = userStoreSetup();

  const payload: EntityCreate<User> = {
    displayName: 'eCrow',
  };

  store.dispatch(userActions.create(payload));

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
test('should fetch user data', async () => {
  const store = userStoreSetup();

  const action = await store.dispatch(
    entityApi.endpoints.read.initiate({ body: {} }),
  );
  const { status } = action;

  expect(status).toBe('fulfilled');
});
