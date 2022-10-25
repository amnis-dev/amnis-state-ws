import { historyBase } from '@amnis/core';
import {
  historyInitialState,
  historySelectors,
  historyActions,
} from './history.js';
import { historyDefault } from './history.default.js';

import { historyStoreSetup } from './history.store.js';

/**
 * ============================================================
 */
test('history should return the initial state', () => {
  const store = historyStoreSetup();

  expect(
    store.getState().history,
  ).toEqual(historyInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new history', () => {
  const store = historyStoreSetup();

  const action = historyActions.create({ ...historyDefault });

  store.dispatch(action);
  const entities = historySelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(historyBase));
});
