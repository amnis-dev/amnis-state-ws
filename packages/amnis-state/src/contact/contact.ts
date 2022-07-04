import {
  createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers';
import { apiExtraReducers } from '@amnis/api/reducers';
import { Contact, contactKey } from '@amnis/core/contact';
import type { ContactMeta } from './contact.types';

/**
 * RTK contact adapter.
 * Manages the normalized entities.
 */
export const contactAdapter = createEntityAdapter<Contact>({
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
 * Initialized contact state with meta information.
 */
export const contactInitialState = contactAdapter.getInitialState<ContactMeta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK Contact Slice
 */
export const contactSlice = createSlice({
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
};

/**
 * Contact redux selector keys.
 */
export type ContactSelector = Extract<keyof typeof contactSelectors, string>;

/**
 * Export the slice as default.
 */
export default contactSlice;
