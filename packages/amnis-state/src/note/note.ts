import {
  createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';
import { coreReducers, coreExtraReducers } from '@amnis/core/reducers';
import { apiExtraReducers } from '@amnis/api/reducers';
import { Note, noteKey } from '@amnis/core/note';
import type { NoteMeta } from './note.types';

/**
 * RTK note adapter.
 * Manages the normalized entities.
 */
export const noteAdapter = createEntityAdapter<Note>({
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
 * Initialized note state with meta information.
 */
export const noteInitialState = noteAdapter.getInitialState<NoteMeta>({
  active: null,
  focused: null,
  selection: [],
});

/**
 * RTK Note Slice
 */
export const noteSlice = createSlice({
  name: noteKey,
  initialState: noteInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Note>(noteKey, noteAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(noteKey, noteAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(noteKey, noteAdapter, builder);
  },
});

/**
 * Note redux reducer.
 */
export const noteReducer = noteSlice.reducer;

/**
 * Note redux actions.
 */
export const noteActions = noteSlice.actions;

/**
 * Note redux selectors.
 */
export const noteSelectors = {
  /**
   * Gets entity selectors.
   */
  ...noteAdapter.getSelectors<{
    [noteKey]: typeof noteInitialState;
  }>((state) => state[noteKey]),
};

/**
 * Note redux selector keys.
 */
export type NoteSelector = Extract<keyof typeof noteSelectors, string>;

/**
 * Export the slice as default.
 */
export default noteSlice;