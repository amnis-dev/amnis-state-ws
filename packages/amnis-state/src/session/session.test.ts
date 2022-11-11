import { sessionBase } from '@amnis/core';
import {
  sessionInitialState,
  sessionSelectors,
  sessionActions,
} from './session.js';
import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('session should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().session,
  ).toEqual(sessionInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new session', () => {
  const store = storeSetup();

  const action = sessionActions.create({ ...sessionBase });

  store.dispatch(action);
  const entities = sessionSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    $id: expect.any(String),
    $subject: expect.any(String),
    name: expect.any(String),
  }));
});
