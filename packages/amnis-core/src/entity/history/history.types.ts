/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';
import type { UID } from '../../types.js';
import type {
  StateCreator, StateDeleter, StateUpdater,
} from '../../state/state.types.js';
import { GrantTask } from '../../state/index.js';

/**
 * List of State Mutators history can log.
 */
export type HistoryStateMutator = StateCreator | StateUpdater | StateDeleter;

/**
 * Historical updates to data.
 */
export interface History extends EntityCreator {
  /**
   * The subject that was updated.
   */
  readonly $subject: UID;

  /**
   * The state task performed.
   */
  task: GrantTask;

  /**
   * The state mutation record that was performed.
   */
  mutation: any;
}

/**
 * History properties excluding the extended entity properties.
 */
export type HistoryBase = EntityCreatorBase<History>;

/**
 * Base properties in order to create a log.
 */
export type HistoryCreator = EntityCreatorParams<History, '$subject' | 'task' | 'mutation'>;
