import {
  profileInitialState,
  profileSelectors,
  profileActions,
} from './profile';
import { profileDefault } from './profile.default';

import { profileStoreSetup } from './profile.store';

/**
 * ============================================================
 */
test('profile should return the initial state', () => {
  const store = profileStoreSetup();

  expect(
    store.getState().profile,
  ).toEqual(profileInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new profile', () => {
  const store = profileStoreSetup();

  const action = profileActions.create({ ...profileDefault });

  store.dispatch(action);
  const entities = profileSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    $user: expect.any(String),
    nameDisplay: expect.any(String),
  }));
});
