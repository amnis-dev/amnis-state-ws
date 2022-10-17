import { uid } from '../uid.js';
import { Entity, entityCreate } from '../entity/index.js';
import type { Note, NoteBase, NoteBaseCreate } from './note.types.js';

export const noteKey = 'note';

export const noteBase: NoteBase = {
  $subject: uid(''),
  text: '',
};

export function noteCreate(
  note: NoteBaseCreate,
  entity: Partial<Entity> = {},
): Note {
  const noteEntity = entityCreate<Note>(noteKey, {
    ...noteBase,
    ...note,
  }, entity);

  return noteEntity;
}
