import { coreActions, userCreator, userKey } from '@amnis/core';
import {
  userInitialState,
  userSelectors,
} from './user.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('user should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().user,
  ).toEqual(userInitialState);
});

/**
 * ============================================================
 */
test('should not generically create a new user with mismatched keys', () => {
  const store = storeSetup();

  const action = coreActions.create({
    [`not_${userKey}`]: [
      userCreator({
        handle: 'eCrow',
        $roles: [],
      }),
    ],
  });

  store.dispatch(action);
  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(0);
});

/**
 * ============================================================
 */
test('should handle generically creating a new user', () => {
  const store = storeSetup();

  const action = coreActions.create({
    [userKey]: [
      userCreator({
        handle: 'eCrow',
        $roles: [],
      }),
    ],
  });

  store.dispatch(action);
  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    $id: expect.any(String),
    handle: expect.any(String),
    $roles: expect.any(Array),
  }));
});
