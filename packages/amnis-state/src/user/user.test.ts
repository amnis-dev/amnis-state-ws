import { apiMockGenerateHandlers, apiMockServer } from '@amnis/core/api/api.mock';
import { stateApiBaseUrl, stateApiHandlersGenerate } from '@amnis/query/stateApi';
import {
  stateApi,
} from '@amnis/query/stateApi/stateApi.node';
import { AnyAction } from '@reduxjs/toolkit';
import {
  userInitialState,
  userActions,
  userSelectors,
} from './user';

import { userStoreSetup } from './user.store';

const mockHandlers = apiMockGenerateHandlers(stateApiBaseUrl, stateApiHandlersGenerate());
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
    store.getState()['entity:user'],
  ).toEqual(userInitialState);
});

/**
 * ============================================================
 */
test('should handle the creation of a new user with a valid matched key', () => {
  const store = userStoreSetup();

  const action = userActions.create({
    displayName: 'eCrow',
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
      body: userActions.create({
        displayName: 'eCrow',
      }),
    }),
  );

  expect(action.status).toBe('fulfilled');

  const data = action.data as AnyAction;

  store.dispatch(data);

  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);
});
