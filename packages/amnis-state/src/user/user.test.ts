import { coreActions } from '@amnis/core/actions';
import {
  userInitialState,
  userSelectors,
  userKey,
} from './user';

import { userStoreSetup } from './user.store';

/**
 * ============================================================
 */
test('user should return the initial state', () => {
  const store = userStoreSetup();

  expect(
    store.getState().user,
  ).toEqual(userInitialState);
});

/**
 * ============================================================
 */
test('should not generically create a new user with mismatched keys', () => {
  const store = userStoreSetup();

  const action = coreActions.create({
    [`not_${userKey}`]: [
      {
        name: 'eCrow',
        $roles: [],
      },
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
  const store = userStoreSetup();

  const action = coreActions.create({
    [userKey]: [
      {
        name: 'eCrow',
        $roles: [],
      },
    ],
  });

  store.dispatch(action);
  const entities = userSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    $id: expect.any(String),
    name: expect.any(String),
    $roles: expect.any(Array),
  }));
});
