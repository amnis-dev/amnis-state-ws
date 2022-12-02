import { uid } from '../../uid.js';
import type { Note, NoteBase, NoteCreator } from './note.types.js';

export const noteKey = 'note';

export const noteBase: NoteBase = {
  $subject: uid(''),
  text: '',
};

export function noteCreator(
  note: NoteCreator,
): Note {
  return {
    ...noteBase,
    ...note,
    $id: uid(noteKey),
  };
}
