import {
  tokenInitialState,
} from './token.js';

import { tokenStoreSetup } from './token.store.js';

/**
 * ============================================================
 */
test('token should return the initial state', () => {
  const store = tokenStoreSetup();

  expect(
    store.getState().token,
  ).toEqual(tokenInitialState);
});
