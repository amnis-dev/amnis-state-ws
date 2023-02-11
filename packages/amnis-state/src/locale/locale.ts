import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import {
  coreReducers,
  coreExtraReducers,
  Locale,
  localeKey,
  metaInitial,
  coreSelectors,
  Entity,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { LocaleMeta } from './locale.types.js';

/**
 * RTK locale adapter.
 * Manages the normalized entities.
 */
export const localeAdapter = createEntityAdapter<Entity<Locale>>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.$id,

  /**
   * OPTIONAL: Sort by value other than $id.
   */
  // sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized locale state with meta information.
 */
export const localeInitialState = localeAdapter.getInitialState<LocaleMeta>(
  metaInitial<Locale>(),
);

/**
 * RTK Locale Slice
 */
export const localeSlice = createSlice({
  name: localeKey,
  initialState: localeInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Locale>(localeKey, localeAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(localeKey, localeAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(localeKey, localeAdapter, builder);
  },
});

/**
 * Locale redux reducer.
 */
export const localeReducer = localeSlice.reducer;

/**
 * Locale redux actions.
 */
export const localeActions = localeSlice.actions;

/**
 * Locale redux selectors.
 */
export const localeSelectors = {
  /**
   * Gets entity selectors.
   */
  ...localeAdapter.getSelectors<{
    [localeKey]: typeof localeInitialState;
  }>((state) => state[localeKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Locale>(localeKey),
};

/**
 * Locale redux selector keys.
 */
export type LocaleSelector = Extract<keyof typeof localeSelectors, string>;

/**
 * Export the slice as default.
 */
export default localeSlice;
