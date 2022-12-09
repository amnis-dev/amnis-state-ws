import { auditBase, auditCreator } from '@amnis/core';
import {
  auditInitialState,
  auditSelectors,
  auditActions,
} from './audit.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('audit should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().audit,
  ).toEqual(auditInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new audit', () => {
  const store = storeSetup();

  const action = auditActions.create(auditCreator(auditBase()));

  store.dispatch(action);
  const entities = auditSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(auditBase()));
});
