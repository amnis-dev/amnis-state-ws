import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Audit,
  auditKey,
  metaInitial,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { AuditMeta } from './audit.types.js';

/**
 * RTK audit adapter.
 * Manages the normalized entities.
 */
export const auditAdapter = rtk.createEntityAdapter<Audit>({
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
 * Initialized audit state with meta information.
 */
export const auditInitialState = auditAdapter.getInitialState<AuditMeta>(
  metaInitial<Audit>(),
);

/**
 * RTK Audit Slice
 */
export const auditSlice = rtk.createSlice({
  name: auditKey,
  initialState: auditInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Audit>(auditKey, auditAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(auditKey, auditAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(auditKey, auditAdapter, builder);
  },
});

/**
 * Audit redux reducer.
 */
export const auditReducer = auditSlice.reducer;

/**
 * Audit redux actions.
 */
export const auditActions = auditSlice.actions;

/**
 * Audit redux selectors.
 */
export const auditSelectors = {
  /**
   * Gets entity selectors.
   */
  ...auditAdapter.getSelectors<{
    [auditKey]: typeof auditInitialState;
  }>((state) => state[auditKey]),
};

/**
 * Audit redux selector keys.
 */
export type AuditSelector = Extract<keyof typeof auditSelectors, string>;

/**
 * Export the slice as default.
 */
export default auditSlice;
