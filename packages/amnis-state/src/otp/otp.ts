import {
  rtk,
  Otp,
  otpKey,
  dateNumeric,
  UID,
  otpBase,
} from '@amnis/core';
import type { Action, PayloadAction } from '@reduxjs/toolkit';
import type { OtpMeta } from './otp.types.js';

/**
 * Matcher for any otp action.
 */
function isOtpAction(
  action: Action<string>,
): action is PayloadAction {
  return action.type.startsWith(otpKey);
}

/**
 * RTK otp adapter.
 * Manages the normalized entities.
 */
export const otpAdapter = rtk.createEntityAdapter<Otp>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (otp) => otp.$id,

  /**
   * OPTIONAL: Sort by value other than $id.
   */
  // sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized otp state with meta information.
 */
export const otpInitialState = otpAdapter.getInitialState<OtpMeta>({
  latest: null,
});

/**
 * RTK Otp Slice
 */
export const otpSlice = rtk.createSlice({
  name: otpKey,
  initialState: otpInitialState,
  reducers: {
    insert: (state, action: PayloadAction<Partial<Otp> & { $id: Otp['$id'] }>) => {
      otpAdapter.addOne(
        state,
        {
          ...otpBase(),
          ...action.payload,
          $id: action.payload.$id,
        },
      );
    },
    delete: (state, action: PayloadAction<UID>) => {
      otpAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    /**
     * Match any otp action.
     */
    builder.addMatcher(isOtpAction, (state) => {
      /**
       * Clean up any expired otps.
       */
      const now = dateNumeric();
      const expiredIds = Object.values(state.entities)
        .filter((e) => e !== undefined && e.exp <= now)
        .map((e) => e?.$id) as UID<Otp>[];

      otpAdapter.removeMany(state, expiredIds);
    });
  },
});

/**
 * Otp redux reducer.
 */
export const otpReducer = otpSlice.reducer;

/**
 * Otp redux actions.
 */
export const otpActions = otpSlice.actions;

/**
 * Otp redux selectors.
 */
export const otpSelectors = {
  /**
   * Gets entity selectors.
   */
  ...otpAdapter.getSelectors<{
    [otpKey]: typeof otpInitialState;
  }>((state) => state[otpKey]),
};

/**
 * Otp redux selector keys.
 */
export type OtpSelector = Extract<keyof typeof otpSelectors, string>;

/**
 * Export the slice as default.
 */
export default otpSlice;
