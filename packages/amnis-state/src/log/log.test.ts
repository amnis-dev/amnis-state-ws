import {
  logInitialState,
  logSelectors,
  logActions,
} from './log';
import { logDefault } from './log.default';

import { logStoreSetup } from './log.store';

/**
 * ============================================================
 */
test('log should return the initial state', () => {
  const store = logStoreSetup();

  expect(
    store.getState().log,
  ).toEqual(logInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new log', () => {
  const store = logStoreSetup();

  const action = logActions.create({ ...logDefault });

  store.dispatch(action);
  const entities = logSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    level: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
  }));
});
