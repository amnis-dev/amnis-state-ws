import { credentialBase, credentialCreator } from '@amnis/core';
import {
  credentialInitialState,
  credentialSelectors,
  credentialActions,
} from './credential.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('credentials should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().credential,
  ).toEqual(credentialInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new credentials', () => {
  const store = storeSetup();

  const action = credentialActions.create(credentialCreator(credentialBase));

  store.dispatch(action);
  const entities = credentialSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
  }));
});
