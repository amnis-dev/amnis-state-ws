import {
  contactInitialState,
  contactSelectors,
  contactActions,
} from './contact.js';
import { contactDefault } from './contact.default.js';

import { contactStoreSetup } from './contact.store.js';

/**
 * ============================================================
 */
test('contact should return the initial state', () => {
  const store = contactStoreSetup();

  expect(
    store.getState().contact,
  ).toEqual(contactInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new contact', () => {
  const store = contactStoreSetup();

  const action = contactActions.create({ ...contactDefault });

  store.dispatch(action);
  const entities = contactSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
  }));
});
