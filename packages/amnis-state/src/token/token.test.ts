import {
  tokenInitialState,
} from './token';

import { tokenStoreSetup } from './token.store';

/**
 * ============================================================
 */
test('token should return the initial state', () => {
  const store = tokenStoreSetup();

  expect(
    store.getState().token,
  ).toEqual(tokenInitialState);
});
