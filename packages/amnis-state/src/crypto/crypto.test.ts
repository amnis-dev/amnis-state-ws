import {
  cryptoInitialState,
  cryptoSelectors,
  cryptoActions,
} from './crypto.js';
import { cryptoDefault } from './crypto.default.js';

import { cryptoStoreSetup } from './crypto.store.js';

/**
 * ============================================================
 */
test('crypto should return the initial state', () => {
  const store = cryptoStoreSetup();

  expect(
    store.getState().crypto,
  ).toEqual(cryptoInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new crypto', () => {
  const store = cryptoStoreSetup();

  const action = cryptoActions.create({ ...cryptoDefault });

  store.dispatch(action);
  const entities = cryptoSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: 'Unknown Crypto Key',
    tag: 'unknown',
    pair: 'public',
    value: '',
  }));
});
