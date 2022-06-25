import {
  createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers';
import { apiExtraReducers } from '@amnis/api/reducers';
import type {
  Profile,
  ProfileMeta,
} from './profile.types';

/**
 * Profile slice key.
 */
export const profileKey = 'profile';

/**
 * RTK profile adapter.
 * Manages the normalized entities.
 */
export const profileAdapter = createEntityAdapter<Profile>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.$id,

  /**
   * Sort by the profile's display name.
   */
  sortComparer: (a, b) => a.nameDisplay.localeCompare(b.nameDisplay),
});

/**
 * Initialized profile state with meta information.
 */
export const profileInitialState = profileAdapter.getInitialState<ProfileMeta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK Profile Slice
 */
export const profileSlice = createSlice({
  name: profileKey,
  initialState: profileInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Profile>(profileKey, profileAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(profileKey, profileAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(profileKey, profileAdapter, builder);
  },
});

/**
 * Profile redux reducer.
 */
export const profileReducer = profileSlice.reducer;

/**
 * Profile redux actions.
 */
export const profileActions = profileSlice.actions;

/**
 * Profile redux selectors.
 */
export const profileSelectors = {
  /**
   * Gets entity selectors.
   */
  ...profileAdapter.getSelectors<{
    [profileKey]: typeof profileInitialState;
  }>((state) => state[profileKey]),
};

/**
 * Profile redux selector keys.
 */
export type ProfileSelector = Extract<keyof typeof profileSelectors, string>;

/**
 * Export the slice as default.
 */
export default profileSlice;
