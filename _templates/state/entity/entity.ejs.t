---
to: <%= `${cwd}/${name}/${name}.ts` %>
---
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type {
  <%= Name %>,
  UserMeta,
  UserRootState,
} from './<%= name %>.types';
import { sliceEntityReducers } from '../slice';

/**
 * RTK <%= name %> adapter.
 */
const adapter = createEntityAdapter<<%= Name %>>({
  selectId: (entity) => entity.id,
});

/**
 * Initial <%= name %> map state.
 */
export const userInitialState = adapter.getInitialState({
  active: null,
  focused: null,
  selection: [],
} as UserMeta);

/**
 * RTK <%= Name %> Slice
 */
export const userSlice = createSlice({
  name: '@amnis/<%= name %>',
  initialState: userInitialState,
  reducers: {
    ...sliceEntityReducers<<%= Name %>>(adapter),
  },
});

/**
 * <%= Name %> redux reducer.
 */
export const userReducer = userSlice.reducer;

/**
 * <%= Name %> redux actions.
 */
export const userActions = userSlice.actions;

/**
 * <%= Name %> redux selectors.
 */
export const userSelectors = adapter.getSelectors<UserRootState>((state) => state['@amnis/<%= name %>']);

export default userSlice;
