import { createAction } from '@reduxjs/toolkit';
import type {
  StateCreate,
  StateDelete,
  StateUpdate,
} from './state';

export const coreActions = {
  /**
   * Batch creates entities.
   */
  create: createAction<StateCreate>('@core/create'),

  /**
   * Batch updates entities.
   */
  update: createAction<StateUpdate>('@core/update'),

  /**
   * Batch deletes entities.
   */
  delete: createAction<StateDelete>('@core/delete'),

  /**
   * Wipes all entities from the state.
   */
  expunge: createAction('@core/expunge'),
};

export default { coreActions };
