import { createAction } from '@reduxjs/toolkit';
import {
  StateCreator,
  StateDeleter,
  StateEntities,
  StateUpdater,
} from './state/index.js';

export const coreActions = {
  /**
   * Directly inserts a state object of complete entities.
   */
  insert: createAction<StateEntities>('@core/insert'),

  /**
   * Batch creates entities.
   */
  create: createAction<StateCreator>('@core/create'),

  /**
   * Batch updates entities.
   */
  update: createAction<StateUpdater>('@core/update'),

  /**
   * Batch deletes entities.
   */
  delete: createAction<StateDeleter>('@core/delete'),

  /**
   * Wipes all entities from the state.
   */
  wipe: createAction('@core/wipe'),
};

export default { coreActions };
