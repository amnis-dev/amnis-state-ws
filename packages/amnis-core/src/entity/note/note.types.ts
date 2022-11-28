import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity.types.js';
import { UID } from '../../types.js';

/**
 * A message to aid memory about the historic change.
 */
export interface Note extends Entity {
  /**
   * Subject this note is attached to.
   */
  readonly $subject: UID;

  /**
   * Textual content of the note.
   */
  text: string;
}

/**
 * Note properties excluding the extended entity properties.
 */
export type NoteBase = EntityExtension<Note>;

/**
 * Base properties in order to create a log.
 */
export type NoteCreator = EntityExtensionCreate<Note, '$subject' | 'text'>;
