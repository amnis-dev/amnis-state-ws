import { otpBase, otpCreate } from '@amnis/core';
import {
  otpInitialState,
  otpSelectors,
  otpActions,
} from './otp.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('otps should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().otp,
  ).toEqual(otpInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new otps', () => {
  const store = storeSetup();

  const action = otpActions.insert(otpCreate(otpBase()));

  store.dispatch(action);
  const entities = otpSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    exp: expect.any(Number),
    len: expect.any(Number),
  }));
});
