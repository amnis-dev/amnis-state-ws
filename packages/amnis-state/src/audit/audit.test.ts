import { auditBase } from '@amnis/core';
import {
  auditInitialState,
  auditSelectors,
  auditActions,
} from './audit.js';
import { auditDefault } from './audit.default.js';

import { auditStoreSetup } from './audit.store.js';

/**
 * ============================================================
 */
test('audit should return the initial state', () => {
  const store = auditStoreSetup();

  expect(
    store.getState().audit,
  ).toEqual(auditInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new audit', () => {
  const store = auditStoreSetup();

  const action = auditActions.create({ ...auditDefault });

  store.dispatch(action);
  const entities = auditSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(auditBase));
});
