import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { apiAuth } from '@amnis/api';
import {
  Otp,
  otpKey,
  dateNumeric,
  UID,
  otpBase,
  State,
} from '@amnis/core';
import type { Action, EntityState, PayloadAction } from '@reduxjs/toolkit';
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
export const otpAdapter = createEntityAdapter<Otp>({
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
export const otpSlice = createSlice({
  name: otpKey,
  initialState: otpInitialState,
  reducers: {
    insert: (state, action: PayloadAction<Partial<Otp> & { $id: Otp['$id'] }>) => {
      const otpNew = {
        ...otpBase(),
        ...action.payload,
        $id: action.payload.$id,
      };
      otpAdapter.addOne(
        state,
        otpNew,
      );
      state.latest = otpNew.$id;
    },

    delete: (state, action: PayloadAction<UID>) => {
      if (action.payload === state.latest) {
        state.latest = null;
      }
      otpAdapter.removeOne(state, action.payload);
    },

    deleteMany: (state, action: PayloadAction<UID[]>) => {
      if (state.latest && action.payload.includes(state.latest)) {
        state.latest = null;
      }
      otpAdapter.removeMany(state, action.payload);
    },

    /**
     * Sets the one-time password value on the latest OTP.
     */
    set: (state, action: PayloadAction<string>) => {
      const { latest } = state;
      if (!latest) {
        return;
      }
      otpAdapter.updateOne(state, {
        id: latest,
        changes: { val: action.payload },
      });
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

    /**
     * Match the otp api fullfilled response and add the returned OTP.
     */
    builder.addMatcher(apiAuth.endpoints.otp.matchFulfilled, (state, action) => {
      const { payload: { result } } = action;

      if (result) {
        otpAdapter.addOne(
          state,
          result,
        );
        state.latest = result.$id;
      }
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

  /**
   * Selects the latest Otp on the state.
   */
  selectLatest: (state: State) => {
    const slice = state[otpKey] as OtpMeta & EntityState<Otp>;
    const { latest } = slice;
    if (!latest) {
      return undefined;
    }
    const otpLatest = slice.entities[latest];
    return otpLatest;
  },

  /**
   * Selects the an OTP by the subject (first result).
   */
  selectBySubject: (state: State, $subject: UID) => {
    const slice = state[otpKey] as OtpMeta & EntityState<Otp>;
    const otpsFound = Object.values(slice.entities).filter((o) => (
      o?.$sub === $subject
    )) as Otp[];
    return otpsFound;
  },
};

/**
 * Otp redux selector keys.
 */
export type OtpSelector = Extract<keyof typeof otpSelectors, string>;

/**
 * Export the slice as default.
 */
export default otpSlice;
