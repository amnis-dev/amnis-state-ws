import type { Entity, EntityUpdate } from '../entity/index.js';
import { UID } from '../types.js';

export interface ChronoEntity {
  /**
   * Past records of mutations the entity
   */
  past: EntityUpdate<Entity>[];

  /**
    * Future mutations of the entity
    */
  future: EntityUpdate<Entity>[];
}

export type ChronoEntityRecords = Record<UID, ChronoEntity>;

/**
 * Local chronological entity mutation logs for undo and redo capability.
 */
export interface Chrono {
  /**
   * Past records of mutations on entity in the
   */
  past: UID[];

  /**
   * Future mutations of UIDs.
   */
  future: UID[];

  /**
   * Records of the entity mutations.
   */
  records: ChronoEntityRecords;
}
