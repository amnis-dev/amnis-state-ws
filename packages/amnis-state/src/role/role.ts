import {
  createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers';
import { apiExtraReducers } from '@amnis/api/reducers';
import { Role, roleKey } from '@amnis/core/role';
import type { RoleMeta } from './role.types';

/**
 * RTK role adapter.
 * Manages the normalized entities.
 */
export const roleAdapter = createEntityAdapter<Role>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.$id,

  /**
   * Sort by the role's name.
   */
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized role state with meta information.
 */
export const roleInitialState = roleAdapter.getInitialState<RoleMeta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK Role Slice
 */
export const roleSlice = createSlice({
  name: roleKey,
  initialState: roleInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Role>(roleKey, roleAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(roleKey, roleAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(roleKey, roleAdapter, builder);
  },
});

/**
 * Role redux reducer.
 */
export const roleReducer = roleSlice.reducer;

/**
 * Role redux actions.
 */
export const roleActions = roleSlice.actions;

/**
 * Role redux selectors.
 */
export const roleSelectors = {
  /**
   * Gets entity selectors.
   */
  ...roleAdapter.getSelectors<{
    [roleKey]: typeof roleInitialState;
  }>((state) => state[roleKey]),
};

/**
 * Role redux selector keys.
 */
export type RoleSelector = Extract<keyof typeof roleSelectors, string>;

/**
 * Export the slice as default.
 */
export default roleSlice;
