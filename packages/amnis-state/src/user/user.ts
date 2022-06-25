import {
  createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers';
import { apiExtraReducers } from '@amnis/api/reducers';
import { User, userKey } from '@amnis/core/index';
import type { UserMeta } from './user.types';

/**
 * RTK user adapter.
 * Manages the normalized entities.
 */
export const userAdapter = createEntityAdapter<User>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.$id,

  /**
   * Sort by the user's name.
   */
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized user state with meta information.
 */
export const userInitialState = userAdapter.getInitialState<UserMeta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK User Slice
 */
export const userSlice = createSlice({
  name: userKey,
  initialState: userInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<User>(userKey, userAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(userKey, userAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(userKey, userAdapter, builder);
  },
});

/**
 * User redux reducer.
 */
export const userReducer = userSlice.reducer;

/**
 * User redux actions.
 */
export const userActions = userSlice.actions;

/**
 * User redux selectors.
 */
export const userSelectors = {
  /**
   * Gets entity selectors.
   */
  ...userAdapter.getSelectors<{
    [userKey]: typeof userInitialState;
  }>((state) => state[userKey]),
};

/**
 * User redux selector keys.
 */
export type UserSelector = Extract<keyof typeof userSelectors, string>;

/**
 * Export the slice as default.
 */
export default userSlice;
