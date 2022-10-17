import {
  createEntityAdapter, createSlice,
} from '@amnis/core/rtk.js';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers.js';
import { apiExtraReducers } from '@amnis/api/reducers.js';
import { Locale, localeKey } from '@amnis/core/locale/index.js';
import type { LocaleMeta } from './locale.types.js';

/**
 * RTK locale adapter.
 * Manages the normalized entities.
 */
export const localeAdapter = createEntityAdapter<Locale>({
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
 * Initialized locale state with meta information.
 */
export const localeInitialState = localeAdapter.getInitialState<LocaleMeta>({
  active: null,
  focused: null,
  selection: [],
});

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
};

/**
 * Locale redux selector keys.
 */
export type LocaleSelector = Extract<keyof typeof localeSelectors, string>;

/**
 * Export the slice as default.
 */
export default localeSlice;
