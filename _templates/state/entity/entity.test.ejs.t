---
to: <%= `${cwd}/${name}/${name}.test.ts` %>
---
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
} from './<%= name %>';
import type {
  <%= Name %>,
} from './<%= name %>.types';

import { storeSetup } from './<%= name %>.store';
import { userMockServer } from './<%= name %>.mock';

beforeAll(() => userMockServer.listen());
afterEach(() => userMockServer.resetHandlers());
afterAll(() => userMockServer.close());

/**
 * ============================================================
 */
test('<%= name %> should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()['@amnis/<%= name %>'],
  ).toEqual(userInitialState);
});

/**
 * ============================================================
 */
test('should handle the creation of a new <%= name %>', () => {
  const store = storeSetup();

  const payload: EntityCreate<<%= Name %>> = {
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
  const store = storeSetup();

  const payload: EntityCreate<<%= Name %>> = {
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
test('should fetch <%= name %> data', async () => {
  const store = storeSetup();

  const action = await store.dispatch(entityApi.endpoints.read.initiate({}));
  const { status } = action;

  expect(status).toBe('fulfilled');
});
