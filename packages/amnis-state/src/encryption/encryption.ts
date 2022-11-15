import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Encryption,
  encryptionKey,
  metaInitial,
  coreSelectors,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { EncryptionMeta } from './encryption.types.js';

/**
 * RTK encryption adapter.
 * Manages the normalized entities.
 */
export const encryptionAdapter = rtk.createEntityAdapter<Encryption>({
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
 * Initialized encryption state with meta information.
 */
export const encryptionInitialState = encryptionAdapter.getInitialState<EncryptionMeta>(
  metaInitial<Encryption>(),
);

/**
 * RTK Encryption Slice
 */
export const encryptionSlice = rtk.createSlice({
  name: encryptionKey,
  initialState: encryptionInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Encryption>(encryptionKey, encryptionAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(encryptionKey, encryptionAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(encryptionKey, encryptionAdapter, builder);
  },
});

/**
 * Encryption redux reducer.
 */
export const encryptionReducer = encryptionSlice.reducer;

/**
 * Encryption redux actions.
 */
export const encryptionActions = encryptionSlice.actions;

/**
 * Encryption redux selectors.
 */
export const encryptionSelectors = {
  /**
   * Gets entity selectors.
   */
  ...encryptionAdapter.getSelectors<{
    [encryptionKey]: typeof encryptionInitialState;
  }>((state) => state[encryptionKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Encryption>(encryptionKey),
};

/**
 * Encryption redux selector keys.
 */
export type EncryptionSelector = Extract<keyof typeof encryptionSelectors, string>;

/**
 * Export the slice as default.
 */
export default encryptionSlice;
