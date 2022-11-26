import { uid } from '../../uid.js';
import type { EntityCreator } from '../entity.types.js';
import type { Note, NoteBase, NoteBaseCreate } from './note.types.js';

export const noteKey = 'note';

export const noteBase: NoteBase = {
  $subject: uid(''),
  text: '',
};

export function noteCreator(
  note: NoteBaseCreate,
): EntityCreator<Note> {
  return {
    ...noteBase,
    ...note,
    $id: uid(noteKey),
  };
}
