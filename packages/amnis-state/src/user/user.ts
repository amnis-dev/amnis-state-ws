import {
  createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { entityReducers, entityExtraReducers } from '@amnis/core/entity';
import type {
  User,
  UserMeta,
} from './user.types';

/**
 * User slice key.
 */
export const userKey = 'user';

/**
 * RTK user adapter.
 * Manages the normalized entities.
 */
export const userAdapter = createEntityAdapter<User>({
  selectId: (entity) => entity.$id,
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
     * Required: Enables mutations from entity actions.
     */
    ...entityReducers<User>(userAdapter),
  },
  extraReducers: (builder) => {
    entityExtraReducers(userKey, userAdapter, builder);
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
