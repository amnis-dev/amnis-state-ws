import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Bearer, bearerKey,
} from '@amnis/core';
import { apiAuth } from '@amnis/api';

import type { BearerMeta } from './bearer.types.js';

/**
 * RTK bearer adapter.
 * Manages the normalized entities.
 */
export const bearerAdapter = createEntityAdapter<Bearer>({
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

type BearerUpdater = {id: string} & Partial<Omit<Bearer, 'id'>>;

/**
 * RTK Bearer Slice
 */
export const bearerSlice = createSlice({
  name: bearerKey,
  initialState: bearerInitialState,
  reducers: {
    wipe(state) {
      bearerAdapter.removeAll(state);
    },
    update(state, action: PayloadAction<BearerUpdater>) {
      const { id, ...changes } = action.payload;
      bearerAdapter.updateOne(state, {
        id,
        changes,
      });
    },
    updateMany(state, action: PayloadAction<BearerUpdater[]>) {
      const updaters = action.payload.map((updater) => {
        const { id, ...changes } = updater;
        return { id, changes };
      });
      bearerAdapter.updateMany(state, updaters);
    },
  },
  extraReducers: (builder) => {
    /**
     * Get bearers from a successful authentication (logging in with an existing session).
     */
    builder.addMatcher(apiAuth.endpoints.authenticate.matchFulfilled, (state, action) => {
      const { payload } = action;
      const { bearers } = payload;

      if (bearers?.length) {
        bearerAdapter.upsertMany(state, bearers);
      }
    });

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
     * Get bearers from a successful registration.
     */
    builder.addMatcher(apiAuth.endpoints.register.matchFulfilled, (state, action) => {
      const { payload: { bearers } } = action;

      if (bearers?.length) {
        bearerAdapter.upsertMany(state, bearers);
      }
    });

    /**
     * Remove core bearer on logout. Wipes the token when the logout is triggered.
     */
    builder.addMatcher(apiAuth.endpoints.logout.matchPending, (state) => {
      bearerAdapter.removeAll(state);
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
