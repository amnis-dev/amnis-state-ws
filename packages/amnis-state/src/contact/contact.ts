import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Contact,
  contactKey,
  metaInitial,
  coreSelectors,
  Entity,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { ContactMeta } from './contact.types.js';

/**
 * RTK contact adapter.
 * Manages the normalized entities.
 */
export const contactAdapter = rtk.createEntityAdapter<Entity<Contact>>({
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
 * Initialized contact state with meta information.
 */
export const contactInitialState = contactAdapter.getInitialState<ContactMeta>(
  metaInitial<Contact>(),
);

/**
 * RTK Contact Slice
 */
export const contactSlice = rtk.createSlice({
  name: contactKey,
  initialState: contactInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Contact>(contactKey, contactAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(contactKey, contactAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(contactKey, contactAdapter, builder);
  },
});

/**
 * Contact redux reducer.
 */
export const contactReducer = contactSlice.reducer;

/**
 * Contact redux actions.
 */
export const contactActions = contactSlice.actions;

/**
 * Contact redux selectors.
 */
export const contactSelectors = {
  /**
   * Gets entity selectors.
   */
  ...contactAdapter.getSelectors<{
    [contactKey]: typeof contactInitialState;
  }>((state) => state[contactKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Contact>(contactKey),
};

/**
 * Contact redux selector keys.
 */
export type ContactSelector = Extract<keyof typeof contactSelectors, string>;

/**
 * Export the slice as default.
 */
export default contactSlice;
