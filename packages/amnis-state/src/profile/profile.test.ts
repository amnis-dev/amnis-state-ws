import { profileBase } from '@amnis/core';
import {
  profileInitialState,
  profileSelectors,
  profileActions,
} from './profile.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('profile should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().profile,
  ).toEqual(profileInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new profile', () => {
  const store = storeSetup();

  const action = profileActions.create({ ...profileBase });

  store.dispatch(action);
  const entities = profileSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    $user: expect.any(String),
    nameDisplay: expect.any(String),
  }));
});
