import { historyBase, historyCreator } from '@amnis/core';
import {
  historyInitialState,
  historySelectors,
  historyActions,
} from './history.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('history should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().history,
  ).toEqual(historyInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new history', () => {
  const store = storeSetup();

  const action = historyActions.create(historyCreator(historyBase()));

  store.dispatch(action);
  const entities = historySelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(historyBase()));
});
