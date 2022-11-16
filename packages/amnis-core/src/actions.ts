import { rtk } from './rtk.js';
import type {
  StateCreator,
  StateDeleter,
} from './state/index.js';

export const coreActions = {
  /**
   * Batch creates entities.
   */
  create: rtk.createAction<StateCreator>('@core/create'),

  /**
   * Batch updates entities.
   */
  update: rtk.createAction<StateCreator>('@core/update'),

  /**
   * Batch deletes entities.
   */
  delete: rtk.createAction<StateDeleter>('@core/delete'),

  /**
   * Wipes all entities from the state.
   */
  wipe: rtk.createAction('@core/wipe'),
};

export default { coreActions };
