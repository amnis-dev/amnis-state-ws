import { createAction } from '@reduxjs/toolkit';
import type {
  StateCreate,
  StateDelete,
} from './state/index.js';

export const coreActions = {
  /**
   * Batch creates entities.
   */
  create: createAction<StateCreate>('@core/create'),

  /**
   * Batch updates entities.
   */
  update: createAction<StateCreate>('@core/update'),

  /**
   * Batch deletes entities.
   */
  delete: createAction<StateDelete>('@core/delete'),

  /**
   * Wipes all entities from the state.
   */
  wipe: createAction('@core/wipe'),
};

export default { coreActions };
