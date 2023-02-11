import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Key,
  keyKey,
} from '@amnis/core';

/**
 * RTK key adapter.
 * Manages the normalized entities.
 */
export const keyAdapter = createEntityAdapter<Key>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.id,

  /**
   * OPTIONAL: Sort by value other than $id.
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
export const keySlice = createSlice({
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
