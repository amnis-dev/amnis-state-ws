---
to: "<%= path ? `${path}/${name}/${name}.ts` : null %>"
---
import {
  createEntityAdapter, createSlice,
} from '@amnis/core/rtk';
import { coreReducers, coreExtraReducers, <%= Name %>, <%= name %>Key } from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { <%= Name %>Meta } from './<%= name %>.types.js';

/**
 * RTK <%= name %> adapter.
 * Manages the normalized entities.
 */
export const <%= name %>Adapter = createEntityAdapter<<%= Name %>>({
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
