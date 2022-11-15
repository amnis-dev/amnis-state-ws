import { encryptionBase } from '@amnis/core';
import {
  encryptionInitialState,
  encryptionSelectors,
  encryptionActions,
} from './encryption.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('encryption should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().encryption,
  ).toEqual(encryptionInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new encryption', () => {
  const store = storeSetup();

  const action = encryptionActions.create({ ...encryptionBase });

  store.dispatch(action);
  const entities = encryptionSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(encryptionBase));
});
