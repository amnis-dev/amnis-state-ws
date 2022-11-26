import type { PayloadAction } from '@reduxjs/toolkit';
import {
  rtk,
  Key,
  keyKey,
} from '@amnis/core';

/**
 * RTK key adapter.
 * Manages the normalized entities.
 */
export const keyAdapter = rtk.createEntityAdapter<Key>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.id,

  /**
   * TODO: A sort comparer other than `$id` is ideal.
   */
  // sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized key state with meta information.
 */
export const keyInitialState = keyAdapter.getInitialState();

/**
 * RTK Key Slice
 */
export const keySlice = rtk.createSlice({
  name: keyKey,
  initialState: keyInitialState,
  reducers: {
    create(state, action: PayloadAction<Key>) {
      keyAdapter.addOne(state, action.payload);
    },
  },
});

/**
 * Key redux reducer.
 */
export const keyReducer = keySlice.reducer;

/**
 * Key redux actions.
 */
export const keyActions = keySlice.actions;

/**
 * Key redux selectors.
 */
export const keySelectors = {
  /**
   * Gets entity selectors.
   */
  ...keyAdapter.getSelectors<{
    [keyKey]: typeof keyInitialState;
  }>((state) => state[keyKey]),
};

/**
 * Key redux selector keys.
 */
export type EncryptionSelector = Extract<keyof typeof keySelectors, string>;

/**
 * Export the slice as default.
 */
export default keySlice;