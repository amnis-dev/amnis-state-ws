import { noteKey, noteCreate, noteBase } from './note.js';

/**
 * ============================================================
 */
test('note key should be is properly set', () => {
  expect(noteKey).toEqual('note');
});

/**
 * ============================================================
 */
test('should create a note', () => {
  const note = noteCreate(noteBase);

  expect(note).toEqual(
    expect.objectContaining(noteBase),
  );
});
