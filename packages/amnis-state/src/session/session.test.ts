import {
  sessionInitialState,
  sessionSelectors,
  sessionActions,
} from './session';
import { sessionDefault } from './session.default';

import { sessionStoreSetup } from './session.store';

/**
 * ============================================================
 */
test('session should return the initial state', () => {
  const store = sessionStoreSetup();

  expect(
    store.getState().session,
  ).toEqual(sessionInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new session', () => {
  const store = sessionStoreSetup();

  const action = sessionActions.create({ ...sessionDefault });

  store.dispatch(action);
  const entities = sessionSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    $user: expect.any(String),
    grants: expect.any(Array),
    expires: expect.any(String),
  }));
});
