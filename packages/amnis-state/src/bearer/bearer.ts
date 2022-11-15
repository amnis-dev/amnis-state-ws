import { rtk, Bearer, bearerKey } from '@amnis/core';
import { apiAuth } from '@amnis/api';

import type { BearerMeta } from './bearer.types.js';

/**
 * RTK bearer adapter.
 * Manages the normalized entities.
 */
export const bearerAdapter = rtk.createEntityAdapter<Bearer>({
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
 * Initialized bearer state with meta information.
 */
export const bearerInitialState = bearerAdapter.getInitialState<BearerMeta>({});

/**
 * RTK Bearer Slice
 */
export const bearerSlice = rtk.createSlice({
  name: bearerKey,
  initialState: bearerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * Get bearers from a successful login.
     */
    builder.addMatcher(apiAuth.endpoints.login.matchFulfilled, (state, action) => {
      const { payload } = action;
      const { bearers } = payload;

      if (bearers?.length) {
        bearerAdapter.upsertMany(state, bearers);
      }
    });

    /**
     * Get bearers from a successful pkce auth flow.
     */
    builder.addMatcher(apiAuth.endpoints.pkce.matchFulfilled, (state, action) => {
      const { payload } = action;
      const { bearers } = payload;

      if (bearers?.length) {
        bearerAdapter.upsertMany(state, bearers);
      }
    });

    /**
     * Get bearers from a successful renewal.
     */
    builder.addMatcher(apiAuth.endpoints.renew.matchFulfilled, (state, action) => {
      const { payload } = action;
      const { bearers } = payload;

      if (bearers?.length) {
        bearerAdapter.upsertMany(state, bearers);
      }
    });

    /**
     * Remove all bearers from the state.
     */
    builder.addMatcher(rtk.isAnyOf(
      apiAuth.endpoints.logout.matchFulfilled,
      apiAuth.endpoints.logout.matchRejected,
    ), (state) => {
      const bearerIds = state.ids;
      bearerAdapter.removeMany(state, bearerIds);
    });
  },
});

/**
 * Bearer redux reducer.
 */
export const bearerReducer = bearerSlice.reducer;

/**
 * Bearer redux actions.
 */
export const bearerActions = bearerSlice.actions;

/**
 * Bearer redux selectors.
 */
export const bearerSelectors = {
  /**
   * Gets entity selectors.
   */
  ...bearerAdapter.getSelectors<{
    [bearerKey]: typeof bearerInitialState;
  }>((state) => state[bearerKey]),
};

/**
 * Bearer redux selector keys.
 */
export type BearerSelector = Extract<keyof typeof bearerSelectors, string>;

/**
 * Export the slice as default.
 */
export default bearerSlice;
