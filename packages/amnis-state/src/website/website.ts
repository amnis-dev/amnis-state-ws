import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Website,
  websiteKey,
  metaInitial,
  coreSelectors,
  Entity,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { WebsiteMeta } from './website.types.js';

/**
 * RTK website adapter.
 * Manages the normalized entities.
 */
export const websiteAdapter = rtk.createEntityAdapter<Entity<Website>>({
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
 * Initialized website state with meta information.
 */
export const websiteInitialState = websiteAdapter.getInitialState<WebsiteMeta>(
  metaInitial<Website>(),
);

/**
 * RTK Website Slice
 */
export const websiteSlice = rtk.createSlice({
  name: websiteKey,
  initialState: websiteInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Website>(websiteKey, websiteAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(websiteKey, websiteAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(websiteKey, websiteAdapter, builder);
  },
});

/**
 * Website redux reducer.
 */
export const websiteReducer = websiteSlice.reducer;

/**
 * Website redux actions.
 */
export const websiteActions = websiteSlice.actions;

/**
 * Website redux selectors.
 */
export const websiteSelectors = {
  /**
   * Gets entity selectors.
   */
  ...websiteAdapter.getSelectors<{
    [websiteKey]: typeof websiteInitialState;
  }>((state) => state[websiteKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Website>(websiteKey),
};

/**
 * Website redux selector keys.
 */
export type WebsiteSelector = Extract<keyof typeof websiteSelectors, string>;

/**
 * Export the slice as default.
 */
export default websiteSlice;
