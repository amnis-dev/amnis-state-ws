import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Log,
  logKey,
  metaInitial,
  coreSelectors,
  Entity,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { LogMeta } from './log.types.js';

/**
 * RTK log adapter.
 * Manages the normalized entities.
 */
export const logAdapter = rtk.createEntityAdapter<Entity<Log>>({
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
 * Initialized log state with meta information.
 */
export const logInitialState = logAdapter.getInitialState<LogMeta>(
  metaInitial<Log>(),
);

/**
 * RTK Log Slice
 */
export const logSlice = rtk.createSlice({
  name: logKey,
  initialState: logInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Log>(logKey, logAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(logKey, logAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(logKey, logAdapter, builder);
  },
});

/**
 * Log redux reducer.
 */
export const logReducer = logSlice.reducer;

/**
 * Log redux actions.
 */
export const logActions = logSlice.actions;

/**
 * Log redux selectors.
 */
export const logSelectors = {
  /**
   * Gets entity selectors.
   */
  ...logAdapter.getSelectors<{
    [logKey]: typeof logInitialState;
  }>((state) => state[logKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Log>(logKey),
};

/**
 * Log redux selector keys.
 */
export type LogSelector = Extract<keyof typeof logSelectors, string>;

/**
 * Export the slice as default.
 */
export default logSlice;
