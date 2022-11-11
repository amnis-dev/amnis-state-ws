import {
  tokenInitialState,
} from './token.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('token should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().token,
  ).toEqual(tokenInitialState);
});
