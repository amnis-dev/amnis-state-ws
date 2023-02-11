import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import {
  coreReducers,
  coreExtraReducers,
  Credential,
  credentialKey,
  metaInitial,
  coreSelectors,
  Entity,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { CredentialMeta } from './credential.types.js';

/**
 * RTK credential adapter.
 * Manages the normalized entities.
 */
export const credentialAdapter = createEntityAdapter<Entity<Credential>>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.$id,

  /**
   * OPTIONAL: Sort by value other than $id.
   */
  // sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized credential state with meta information.
 */
export const credentialInitialState = credentialAdapter.getInitialState<CredentialMeta>(
  metaInitial<Credential>(),
);

/**
 * RTK Credential Slice
 */
export const credentialSlice = createSlice({
  name: credentialKey,
  initialState: credentialInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Credential>(credentialKey, credentialAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(credentialKey, credentialAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(credentialKey, credentialAdapter, builder);
  },
});

/**
 * Credential redux reducer.
 */
export const credentialReducer = credentialSlice.reducer;

/**
 * Credential redux actions.
 */
export const credentialActions = credentialSlice.actions;

/**
 * Credential redux selectors.
 */
export const credentialSelectors = {
  /**
   * Gets entity selectors.
   */
  ...credentialAdapter.getSelectors<{
    [credentialKey]: typeof credentialInitialState;
  }>((state) => state[credentialKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Credential>(credentialKey),
};

/**
 * Credential redux selector keys.
 */
export type CredentialSelector = Extract<keyof typeof credentialSelectors, string>;

/**
 * Export the slice as default.
 */
export default credentialSlice;
