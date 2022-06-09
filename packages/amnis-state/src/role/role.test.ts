import {
  roleInitialState,
  roleSelectors,
  roleActions,
} from './role';
import { roleDefault } from './role.default';

import { roleStoreSetup } from './role.store';

/**
 * ============================================================
 */
test('role should return the initial state', () => {
  const store = roleStoreSetup();

  expect(
    store.getState().role,
  ).toEqual(roleInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new role', () => {
  const store = roleStoreSetup();

  const action = roleActions.create({ ...roleDefault });

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
