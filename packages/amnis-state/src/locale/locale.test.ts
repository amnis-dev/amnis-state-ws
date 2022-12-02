import { localeBase, localeCreator } from '@amnis/core';
import {
  localeInitialState,
  localeSelectors,
  localeActions,
} from './locale.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('locale should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().locale,
  ).toEqual(localeInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new locale', () => {
  const store = storeSetup();

  const action = localeActions.create(localeCreator(localeBase));

  store.dispatch(action);
  const entities = localeSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(localeBase));
});
