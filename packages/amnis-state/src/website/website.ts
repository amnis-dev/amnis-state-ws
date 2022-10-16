import {
  createEntityAdapter, createSlice,
} from '@amnis/core/rtk.js';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers.js';
import { apiExtraReducers } from '@amnis/api/reducers.js';
import { Website, websiteKey } from '@amnis/core/website/index.js';
import type { WebsiteMeta } from './website.types.js';

/**
 * RTK website adapter.
 * Manages the normalized entities.
 */
export const websiteAdapter = createEntityAdapter<Website>({
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
 * Initialized website state with meta information.
 */
export const websiteInitialState = websiteAdapter.getInitialState<WebsiteMeta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK Website Slice
 */
export const websiteSlice = createSlice({
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
};

/**
 * Website redux selector keys.
 */
export type WebsiteSelector = Extract<keyof typeof websiteSelectors, string>;

/**
 * Export the slice as default.
 */
export default websiteSlice;
