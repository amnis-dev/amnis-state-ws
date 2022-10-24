import {
  createEntityAdapter, createSlice,
} from '@amnis/core/rtk.js';
import {
  coreReducers,
  coreExtraReducers,
  History,
  historyKey,
} from '@amnis/core/index.js';
import { apiExtraReducers } from '@amnis/api/index.js';
import type { HistoryMeta } from './history.types.js';

/**
 * RTK history adapter.
 * Manages the normalized entities.
 */
export const historyAdapter = createEntityAdapter<History>({
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
 * Initialized history state with meta information.
 */
export const historyInitialState = historyAdapter.getInitialState<HistoryMeta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK History Slice
 */
export const historySlice = createSlice({
  name: historyKey,
  initialState: historyInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<History>(historyKey, historyAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(historyKey, historyAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(historyKey, historyAdapter, builder);
  },
});

/**
 * History redux reducer.
 */
export const historyReducer = historySlice.reducer;

/**
 * History redux actions.
 */
export const historyActions = historySlice.actions;

/**
 * History redux selectors.
 */
export const historySelectors = {
  /**
   * Gets entity selectors.
   */
  ...historyAdapter.getSelectors<{
    [historyKey]: typeof historyInitialState;
  }>((state) => state[historyKey]),
};

/**
 * History redux selector keys.
 */
export type HistorySelector = Extract<keyof typeof historySelectors, string>;

/**
 * Export the slice as default.
 */
export default historySlice;
