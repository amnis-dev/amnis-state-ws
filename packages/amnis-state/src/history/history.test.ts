import { historyBase } from '@amnis/core/history';
import {
  historyInitialState,
  historySelectors,
  historyActions,
} from './history';
import { historyDefault } from './history.default';

import { historyStoreSetup } from './history.store';

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
