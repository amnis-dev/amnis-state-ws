import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type {
  User,
  UserMeta,
  UserRootState,
} from './user.types';
import { sliceEntityReducers } from '../slice';

/**
 * RTK user adapter.
 */
const adapter = createEntityAdapter<User>({
  selectId: (entity) => entity.id,
});

/**
 * Initial user map state.
 */
export const userInitialState = adapter.getInitialState({
  active: null,
  focused: null,
  selection: [],
} as UserMeta);

/**
 * RTK User Slice
 */
export const userSlice = createSlice({
  name: '@amnis/user',
  initialState: userInitialState,
  reducers: {
    ...sliceEntityReducers<User>(adapter),
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
export const userSelectors = adapter.getSelectors<UserRootState>((state) => state['@amnis/user']);

export default userSlice;
