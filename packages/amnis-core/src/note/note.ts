import { uid } from '../uid';
import { Entity, entityCreate } from '../entity';
import type { Note, NoteBase, NoteBaseCreate } from './note.types';

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