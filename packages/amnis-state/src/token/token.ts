import {
  createEntityAdapter, createSlice, isAnyOf,
} from '@amnis/core/rtk';
import { Token, tokenKey } from '@amnis/core';
import { apiAuth } from '@amnis/api';

import type { TokenMeta } from './token.types.js';

/**
 * RTK token adapter.
 * Manages the normalized entities.
 */
export const tokenAdapter = createEntityAdapter<Token>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.id,

  /**
   * In this case, sorting by ID is ideal.
   */
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

/**
 * Initialized token state with meta information.
 */
export const tokenInitialState = tokenAdapter.getInitialState<TokenMeta>({});

/**
 * RTK Token Slice
 */
export const tokenSlice = createSlice({
  name: tokenKey,
  initialState: tokenInitialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * Get tokens from a successful login.
     */
    builder.addMatcher(apiAuth.endpoints.login.matchFulfilled, (state, action) => {
      const { payload } = action;
      const { tokens } = payload;

      if (tokens?.length) {
        tokenAdapter.upsertMany(state, tokens);
      }
    });

    /**
     * Get tokens from a successful pkce auth flow.
     */
    builder.addMatcher(apiAuth.endpoints.pkce.matchFulfilled, (state, action) => {
      const { payload } = action;
      const { tokens } = payload;

      if (tokens?.length) {
        tokenAdapter.upsertMany(state, tokens);
      }
    });

    /**
     * Get tokens from a successful renewal.
     */
    builder.addMatcher(apiAuth.endpoints.renew.matchFulfilled, (state, action) => {
      const { payload } = action;
      const { tokens } = payload;

      if (tokens?.length) {
        tokenAdapter.upsertMany(state, tokens);
      }
    });

    /**
     * Remove all tokens from the state.
     */
    builder.addMatcher(isAnyOf(
      apiAuth.endpoints.logout.matchFulfilled,
      apiAuth.endpoints.logout.matchRejected,
    ), (state) => {
      const tokenIds = state.ids;
      tokenAdapter.removeMany(state, tokenIds);
    });
  },
});

/**
 * Token redux reducer.
 */
export const tokenReducer = tokenSlice.reducer;

/**
 * Token redux actions.
 */
export const tokenActions = tokenSlice.actions;

/**
 * Token redux selectors.
 */
export const tokenSelectors = {
  /**
   * Gets entity selectors.
   */
  ...tokenAdapter.getSelectors<{
    [tokenKey]: typeof tokenInitialState;
  }>((state) => state[tokenKey]),
};

/**
 * Token redux selector keys.
 */
export type TokenSelector = Extract<keyof typeof tokenSelectors, string>;

/**
 * Export the slice as default.
 */
export default tokenSlice;
