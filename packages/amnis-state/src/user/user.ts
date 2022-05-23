import {
  AnyAction, createEntityAdapter, createSlice, isAllOf, PayloadAction,
} from '@reduxjs/toolkit';
import { entityReducers } from '@amnis/core/entity';
import { stateApi } from '@amnis/query/stateApi/stateApi.node';
import { StateApiResponseBodyDispatch } from '@amnis/query/stateApi';
import type {
  User,
  UserMeta,
} from './user.types';

/**
 * User meta key.
 */
export const userKey = 'entity:user';

/**
 * RTK user adapter.
 * Manages the normalized entities.
 */
export const userAdapter = createEntityAdapter<User>({
  selectId: (entity) => entity.id,
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
 * Matcher to determine if a fulfilled payload contains the same key type.
 */
// function isResponseMatchingType(
//   action: PayloadAction<StateApiResponseBodyDispatch>,
// ): action is PayloadAction<StateApiResponseBodyDispatch> {
//   return action.payload.type.startsWith(userKey);
// }

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
export const userSelectors = userAdapter.getSelectors<{
  [userKey]: typeof userInitialState;
}>((state) => state[userKey]);

/**
 * Export the slice as default.
 */
export default userSlice;
