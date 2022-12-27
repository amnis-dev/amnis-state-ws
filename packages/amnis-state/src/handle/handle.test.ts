import { handleBase, handleCreator } from '@amnis/core';
import {
  handleInitialState,
  handleSelectors,
  handleActions,
} from './handle.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('handles should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().handle,
  ).toEqual(handleInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new handles', () => {
  const store = storeSetup();

  const action = handleActions.create(handleCreator(handleBase()));

  store.dispatch(action);
  const entities = handleSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    $subject: expect.any(String),
  }));
});
