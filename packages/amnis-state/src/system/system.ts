import {
  createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers.js';
import { apiExtraReducers } from '@amnis/api/reducers.js';
import { System, systemKey } from '@amnis/core/system/index.js';
import type {
  SystemMeta,
} from './system.types.js';

/**
 * RTK system adapter.
 * Manages the normalized entities.
 */
export const systemAdapter = createEntityAdapter<System>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.$id,

  /**
   * TODO: A sort comparer other than `$id` is ideal.
   */
  // sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized system state with meta information.
 */
export const systemInitialState = systemAdapter.getInitialState<SystemMeta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK System Slice
 */
export const systemSlice = createSlice({
  name: systemKey,
  initialState: systemInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<System>(systemKey, systemAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(systemKey, systemAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(systemKey, systemAdapter, builder);
  },
});

/**
 * System redux reducer.
 */
export const systemReducer = systemSlice.reducer;

/**
 * System redux actions.
 */
export const systemActions = systemSlice.actions;

/**
 * System redux selectors.
 */
export const systemSelectors = {
  /**
   * Gets entity selectors.
   */
  ...systemAdapter.getSelectors<{
    [systemKey]: typeof systemInitialState;
  }>((state) => state[systemKey]),
};

/**
 * System redux selector keys.
 */
export type SystemSelector = Extract<keyof typeof systemSelectors, string>;

/**
 * Export the slice as default.
 */
export default systemSlice;
