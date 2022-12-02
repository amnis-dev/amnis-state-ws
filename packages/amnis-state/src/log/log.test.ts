import { logBase, logCreator } from '@amnis/core';
import {
  logInitialState,
  logSelectors,
  logActions,
} from './log.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('log should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().log,
  ).toEqual(logInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new log', () => {
  const store = storeSetup();

  const action = logActions.create(logCreator(logBase));

  store.dispatch(action);
  const entities = logSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    level: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
  }));
});
