import { cryptoBase } from '@amnis/core';
import {
  cryptoInitialState,
  cryptoSelectors,
  cryptoActions,
} from './crypto.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('crypto should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().crypto,
  ).toEqual(cryptoInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new crypto', () => {
  const store = storeSetup();

  const action = cryptoActions.create({ ...cryptoBase });

  store.dispatch(action);
  const entities = cryptoSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(cryptoBase));
});
