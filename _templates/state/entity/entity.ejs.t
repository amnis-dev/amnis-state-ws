---
to: "<%= path ? `${path}/${name}/${name}.ts` : null %>"
---
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type {
  <%= Name %>,
  <%= Name %>Meta,
  <%= Name %>RootState,
} from './<%= name %>.types';
import { entityReducers } from '../entityState';

/**
 * RTK <%= name %> adapter.
 */
const adapter = createEntityAdapter<<%= Name %>>({
  selectId: (entity) => entity.id,
});

/**
 * Initial <%= name %> map state.
 */
export const <%= name %>InitialState = adapter.getInitialState({
  active: null,
  focused: null,
  selection: [],
} as <%= Name %>Meta);

/**
 * RTK <%= Name %> Slice
 */
export const <%= name %>Slice = createSlice({
  name: '@amnis/<%= name %>',
  initialState: <%= name %>InitialState,
  reducers: {
    ...entityReducers<<%= Name %>>(adapter),
  },
});

/**
 * <%= Name %> redux reducer.
 */
export const <%= name %>Reducer = <%= name %>Slice.reducer;

/**
 * <%= Name %> redux actions.
 */
export const <%= name %>Actions = <%= name %>Slice.actions;

/**
 * <%= Name %> redux selectors.
 */
export const <%= name %>Selectors = adapter.getSelectors<<%= Name %>RootState>((state) => state['@amnis/<%= name %>']);

export default <%= name %>Slice;
