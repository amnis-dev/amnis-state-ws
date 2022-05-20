import {
  entityApi,
} from '@amnis/query/entityApi/entityApi.node';

import {
  userInitialState,
  userActions,
} from '../user';
import type {
  UserPayloadCreate,
} from '../user.types';

import { setupStore } from './user.store';

import { userMockServer } from './user.mock';

beforeAll(() => userMockServer.listen());
afterEach(() => userMockServer.resetHandlers());
afterAll(() => userMockServer.close());

test('user should return the initial state', () => {
  const store = setupStore();

  expect(
    store.getState().user,
  ).toEqual(userInitialState);
});

test('should handle user state being set', () => {
  const store = setupStore();

  const payload: UserPayloadCreate = {
    displayName: 'eCrow',
  };

  store.dispatch(userActions.set(payload));

  expect(
    store.getState().user,
  ).toEqual({
    ...userInitialState,
    ...payload,
  });
});

test('should fetch user data', async () => {
  const store = setupStore();

  const action = await store.dispatch(entityApi.endpoints.read.initiate({}));
  const { status } = action;

  expect(status).toBe('fulfilled');

  // expect(
  //   store.getState().user,
  // ).toEqual({
  //   ...userInitialState,
  //   ...payload,
  // });
});
