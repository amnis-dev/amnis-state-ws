import type { PayloadAction } from '@reduxjs/toolkit';
import { rtk, Api, apiKey } from '@amnis/core';

import type { ApiMeta } from './api.types.js';

/**
 * RTK api adapter.
 * Manages the normalized entities.
 */
export const apiAdapter = rtk.createEntityAdapter<Api>({
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
 * Initialized api state with meta information.
 */
const apiBaseInitialState = apiAdapter.getInitialState<ApiMeta>({});

/**
 * Populate the state with initial defaults.
 */
const apiDefaults: Api[] = [
  {
    id: 'apiAuth',
    baseUrl: '/api/auth',
    signature: ['login', 'register', 'credential', 'create'],
    challenge: ['login', 'register', 'credential', 'create'],
  },
  {
    id: 'apiCrud',
    baseUrl: '/api/crud',
    bearerId: 'core',
  },
];

export const apiInitialState = apiAdapter.upsertMany(apiBaseInitialState, apiDefaults);

/**
 * RTK Api Slice
 */
export const apiSlice = rtk.createSlice({
  name: apiKey,
  initialState: apiInitialState,
  reducers: {
    upsert(state, action: PayloadAction<Api>) {
      apiAdapter.upsertOne(state, action.payload);
    },
    upsertMany(state, action: PayloadAction<Api[]>) {
      apiAdapter.upsertMany(state, action.payload);
    },
  },
});

/**
 * Api redux reducer.
 */
export const apiReducer = apiSlice.reducer;

/**
 * Api redux actions.
 */
export const apiActions = apiSlice.actions;

/**
 * Api redux selectors.
 */
export const apiSelectors = {
  /**
   * Gets entity selectors.
   */
  ...apiAdapter.getSelectors<{
    [apiKey]: typeof apiInitialState;
  }>((state) => state[apiKey]),
};

/**
 * Api redux selector keys.
 */
export type ApiSelector = Extract<keyof typeof apiSelectors, string>;

/**
 * Export the slice as default.
 */
export default apiSlice;
