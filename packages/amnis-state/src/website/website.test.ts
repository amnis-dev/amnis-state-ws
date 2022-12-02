import { websiteBase, websiteCreator } from '@amnis/core';
import {
  websiteInitialState,
  websiteSelectors,
  websiteActions,
} from './website.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('website should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().website,
  ).toEqual(websiteInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new website', () => {
  const store = storeSetup();

  const action = websiteActions.create(websiteCreator(websiteBase));

  store.dispatch(action);
  const entities = websiteSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    url: expect.any(String),
  }));
});
