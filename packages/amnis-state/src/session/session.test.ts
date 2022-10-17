import {
  sessionInitialState,
  sessionSelectors,
  sessionActions,
} from './session.js';
import { sessionDefault } from './session.default.js';
import { sessionStoreSetup } from './session.store.js';

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
    $id: expect.any(String),
    $subject: expect.any(String),
    name: expect.any(String),
  }));
});
