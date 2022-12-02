import { contactBase, contactCreator } from '@amnis/core';
import {
  contactInitialState,
  contactSelectors,
  contactActions,
} from './contact.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('contact should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().contact,
  ).toEqual(contactInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new contact', () => {
  const store = storeSetup();

  const action = contactActions.create(contactCreator(contactBase));

  store.dispatch(action);
  const entities = contactSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
  }));
});
