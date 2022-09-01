import {
  createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers';
import { apiExtraReducers } from '@amnis/api/reducers';
import { Service, serviceKey } from '@amnis/core/service';
import type { ServiceMeta } from './service.types';

/**
 * RTK service adapter.
 * Manages the normalized entities.
 */
export const serviceAdapter = createEntityAdapter<Service>({
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
 * Initialized service state with meta information.
 */
export const serviceInitialState = serviceAdapter.getInitialState<ServiceMeta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK Service Slice
 */
export const serviceSlice = createSlice({
  name: serviceKey,
  initialState: serviceInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Service>(serviceKey, serviceAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(serviceKey, serviceAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(serviceKey, serviceAdapter, builder);
  },
});

/**
 * Service redux reducer.
 */
export const serviceReducer = serviceSlice.reducer;

/**
 * Service redux actions.
 */
export const serviceActions = serviceSlice.actions;

/**
 * Service redux selectors.
 */
export const serviceSelectors = {
  /**
   * Gets entity selectors.
   */
  ...serviceAdapter.getSelectors<{
    [serviceKey]: typeof serviceInitialState;
  }>((state) => state[serviceKey]),
};

/**
 * Service redux selector keys.
 */
export type ServiceSelector = Extract<keyof typeof serviceSelectors, string>;

/**
 * Export the slice as default.
 */
export default serviceSlice;