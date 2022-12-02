import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';
import { UID } from '../../types.js';

/**
 * Historical updates to data.
 */
export interface History extends EntityCreator {
  /**
   * The subject that was updated.
   */
  readonly $subject: UID;

  /**
   * The state update record that was performed.
   */
  changes: Partial<EntityCreatorBase<EntityCreator>>;
}

/**
 * History properties excluding the extended entity properties.
 */
export type HistoryBase = EntityCreatorBase<History>;

/**
 * Base properties in order to create a log.
 */
export type HistoryCreator = EntityCreatorParams<History, '$subject' | 'changes'>;
