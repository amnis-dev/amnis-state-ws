import { noteBase } from '@amnis/core/note';
import {
  noteInitialState,
  noteSelectors,
  noteActions,
} from './note';
import { noteDefault } from './note.default';

import { noteStoreSetup } from './note.store';

/**
 * ============================================================
 */
test('note should return the initial state', () => {
  const store = noteStoreSetup();

  expect(
    store.getState().note,
  ).toEqual(noteInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new note', () => {
  const store = noteStoreSetup();

  const action = noteActions.create({ ...noteDefault });

  store.dispatch(action);
  const entities = noteSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(noteBase));
});
