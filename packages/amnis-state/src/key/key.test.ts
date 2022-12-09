import { keyBase } from '@amnis/core';
import {
  keyInitialState,
  keySelectors,
  keyActions,
} from './key.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('key should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().key,
  ).toEqual(keyInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new key', () => {
  const store = storeSetup();

  const action = keyActions.create(keyBase());

  store.dispatch(action);
  const entities = keySelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(keyBase()));
});
