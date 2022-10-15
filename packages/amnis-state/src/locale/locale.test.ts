import { localeBase } from '@amnis/core/locale/index.js';
import {
  localeInitialState,
  localeSelectors,
  localeActions,
} from './locale.js';
import { localeDefault } from './locale.default.js';

import { localeStoreSetup } from './locale.store.js';

/**
 * ============================================================
 */
test('locale should return the initial state', () => {
  const store = localeStoreSetup();

  expect(
    store.getState().locale,
  ).toEqual(localeInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new locale', () => {
  const store = localeStoreSetup();

  const action = localeActions.create({ ...localeDefault });

  store.dispatch(action);
  const entities = localeSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(localeBase));
});
