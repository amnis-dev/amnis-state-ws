import { challengeBase, challengeCreate } from '@amnis/core';
import {
  challengeInitialState,
  challengeSelectors,
  challengeActions,
} from './challenge.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('challenges should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().challenge,
  ).toEqual(challengeInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new challenges', () => {
  const store = storeSetup();

  const action = challengeActions.create(challengeCreate(challengeBase()));

  store.dispatch(action);
  const entities = challengeSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    exp: expect.any(Number),
  }));
});
