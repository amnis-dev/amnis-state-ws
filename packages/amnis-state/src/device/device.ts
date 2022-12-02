import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Device,
  deviceKey,
  metaInitial,
  coreSelectors,
  Entity,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { DeviceMeta } from './device.types.js';

/**
 * RTK device adapter.
 * Manages the normalized entities.
 */
export const deviceAdapter = rtk.createEntityAdapter<Entity<Device>>({
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
 * Initialized device state with meta information.
 */
export const deviceInitialState = deviceAdapter.getInitialState<DeviceMeta>(
  metaInitial<Device>(),
);

/**
 * RTK Device Slice
 */
export const deviceSlice = rtk.createSlice({
  name: deviceKey,
  initialState: deviceInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Device>(deviceKey, deviceAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(deviceKey, deviceAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(deviceKey, deviceAdapter, builder);
  },
});

/**
 * Device redux reducer.
 */
export const deviceReducer = deviceSlice.reducer;

/**
 * Device redux actions.
 */
export const deviceActions = deviceSlice.actions;

/**
 * Device redux selectors.
 */
export const deviceSelectors = {
  /**
   * Gets entity selectors.
   */
  ...deviceAdapter.getSelectors<{
    [deviceKey]: typeof deviceInitialState;
  }>((state) => state[deviceKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Device>(deviceKey),
};

/**
 * Device redux selector keys.
 */
export type DeviceSelector = Extract<keyof typeof deviceSelectors, string>;

/**
 * Export the slice as default.
 */
export default deviceSlice;
