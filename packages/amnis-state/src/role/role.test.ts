import { roleBase, roleCreator } from '@amnis/core';
import {
  roleInitialState,
  roleSelectors,
  roleActions,
} from './role.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('role should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().role,
  ).toEqual(roleInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new role', () => {
  const store = storeSetup();

  const action = roleActions.create(roleCreator(roleBase));

  store.dispatch(action);
  const entities = roleSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    description: expect.any(String),
    color: expect.any(String),
    grants: expect.any(Array),
  }));
});
