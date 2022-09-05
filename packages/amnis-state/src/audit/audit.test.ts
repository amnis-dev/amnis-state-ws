import { auditBase } from '@amnis/core/audit';
import {
  auditInitialState,
  auditSelectors,
  auditActions,
} from './audit';
import { auditDefault } from './audit.default';

import { auditStoreSetup } from './audit.store';

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
