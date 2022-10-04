import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity';
import { Identifier } from '../types';

/**
 * A message to aid memory about the historic change.
 */
export interface Note extends Entity {
  /**
   * Subject this note is attached to.
   */
  readonly $subject: Identifier;

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
export type NoteBaseCreate = EntityExtensionCreate<Note, '$subject' | 'text'>;
