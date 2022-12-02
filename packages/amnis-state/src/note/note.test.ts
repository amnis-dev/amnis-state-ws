import { noteBase, noteCreator } from '@amnis/core';
import {
  noteInitialState,
  noteSelectors,
  noteActions,
} from './note.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('note should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().note,
  ).toEqual(noteInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new note', () => {
  const store = storeSetup();

  const action = noteActions.create(noteCreator(noteBase));

  store.dispatch(action);
  const entities = noteSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(noteBase));
});
