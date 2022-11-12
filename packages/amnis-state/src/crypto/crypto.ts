import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Crypto,
  cryptoKey,
  metaInitial,
  coreSelectors,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { CryptoMeta } from './crypto.types.js';

/**
 * RTK crypto adapter.
 * Manages the normalized entities.
 */
export const cryptoAdapter = rtk.createEntityAdapter<Crypto>({
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
 * Initialized crypto state with meta information.
 */
export const cryptoInitialState = cryptoAdapter.getInitialState<CryptoMeta>(
  metaInitial<Crypto>(),
);

/**
 * RTK Crypto Slice
 */
export const cryptoSlice = rtk.createSlice({
  name: cryptoKey,
  initialState: cryptoInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Crypto>(cryptoKey, cryptoAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(cryptoKey, cryptoAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(cryptoKey, cryptoAdapter, builder);
  },
});

/**
 * Crypto redux reducer.
 */
export const cryptoReducer = cryptoSlice.reducer;

/**
 * Crypto redux actions.
 */
export const cryptoActions = cryptoSlice.actions;

/**
 * Crypto redux selectors.
 */
export const cryptoSelectors = {
  /**
   * Gets entity selectors.
   */
  ...cryptoAdapter.getSelectors<{
    [cryptoKey]: typeof cryptoInitialState;
  }>((state) => state[cryptoKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Crypto>(cryptoKey),
};

/**
 * Crypto redux selector keys.
 */
export type CryptoSelector = Extract<keyof typeof cryptoSelectors, string>;

/**
 * Export the slice as default.
 */
export default cryptoSlice;
