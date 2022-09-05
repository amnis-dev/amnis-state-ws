import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity';
import type { StateUpdate } from '../state';
import { DateJSON, Reference } from '../types';

/**
 * Historical updates to data.
 */
export interface History extends Entity {
  /**
   * The subject that created the history.
   */
  $subject?: Reference;

  /**
   * The date of the historical update.
   */
  date: DateJSON;

  /**
   * The state update record that was performed.
   */
  update: StateUpdate;
}

/**
 * History properties excluding the extended entity properties.
 */
export type HistoryBase = EntityExtension<History>;

/**
 * Base properties in order to create a log.
 */
export type HistoryBaseCreate = EntityExtensionCreate<History, 'update' | 'date'>;
