import {
  websiteInitialState,
  websiteSelectors,
  websiteActions,
} from './website';
import { websiteDefault } from './website.default';

import { websiteStoreSetup } from './website.store';

/**
 * ============================================================
 */
test('website should return the initial state', () => {
  const store = websiteStoreSetup();

  expect(
    store.getState().website,
  ).toEqual(websiteInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new website', () => {
  const store = websiteStoreSetup();

  const action = websiteActions.create({ ...websiteDefault });

  store.dispatch(action);
  const entities = websiteSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    url: expect.any(String),
  }));
});
