import {
  systemInitialState,
  systemSelectors,
  systemActions,
} from './system';
import { systemDefault } from './system.default';

import { systemStoreSetup } from './system.store';

/**
 * ============================================================
 */
test('system should return the initial state', () => {
  const store = systemStoreSetup();

  expect(
    store.getState().system,
  ).toEqual(systemInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new system', () => {
  const store = systemStoreSetup();

  const action = systemActions.create({ ...systemDefault });

  store.dispatch(action);
  const entities = systemSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    sessionExpires: expect.any(Number),
    $website: expect.any(String),
    $initialRoles: expect.any(Array),
  }));
});
