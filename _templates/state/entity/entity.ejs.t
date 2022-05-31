---
to: "<%= path ? `${path}/${name}/${name}.ts` : null %>"
---
import {
  createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { <%= Name %> } from '@amnis/core/index';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers';
import { apiExtraReducers } from '@amnis/api/reducers';
import type {
  <%= Name %>Meta,
} from './<%= name %>.types';

/**
 * <%= Name %> slice key.
 */
export const <%= name %>Key = '<%= name %>';

/**
 * RTK <%= name %> adapter.
 * Manages the normalized entities.
 */
export const <%= name %>Adapter = createEntityAdapter<<%= Name %>>({
  selectId: (entity) => entity.$id,
});

/**
 * Initialized <%= name %> state with meta information.
 */
export const <%= name %>InitialState = <%= name %>Adapter.getInitialState<<%= Name %>Meta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK <%= Name %> Slice
 */
export const <%= name %>Slice = createSlice({
  name: <%= name %>Key,
  initialState: <%= name %>InitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<<%= Name %>>(<%= name %>Key, <%= name %>Adapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(<%= name %>Key, <%= name %>Adapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(<%= name %>Key, <%= name %>Adapter, builder);
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
export const <%= name %>Selectors = {
  /**
   * Gets entity selectors.
   */
  ...<%= name %>Adapter.getSelectors<{
    [<%= name %>Key]: typeof <%= name %>InitialState;
  }>((state) => state[<%= name %>Key]),
};

/**
 * <%= Name %> redux selector keys.
 */
export type <%= Name %>Selector = Extract<keyof typeof <%= name %>Selectors, string>;

/**
 * Export the slice as default.
 */
export default <%= name %>Slice;
