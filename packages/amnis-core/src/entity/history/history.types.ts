import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity.types.js';
import { UID } from '../../types.js';

/**
 * Historical updates to data.
 */
export interface History extends Entity {
  /**
   * The subject that was updated.
   */
  readonly $subject: UID;

  /**
   * The state update record that was performed.
   */
  changes: Partial<EntityExtension<Entity>>;
}

/**
 * History properties excluding the extended entity properties.
 */
export type HistoryBase = EntityExtension<History>;

/**
 * Base properties in order to create a log.
 */
export type HistoryCreator = EntityExtensionCreate<History, '$subject' | 'changes'>;
