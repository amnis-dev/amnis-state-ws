import type { Entity, EntityUpdate } from '../entity/index.js';
import { UID } from '../types.js';

/**
 * Local chronological entity mutation logs for undo and redo capability.
 */
export interface Chrono {
  /**
   * Past records of mutations on entity ids.
   */
  past: UID[];

  /**
   * Future mutations of UIDs.
   */
  future: UID[];

  /**
   * Records of the entity mutations.
   */
  records: Record<string, EntityUpdate<Entity>[]>;
}
