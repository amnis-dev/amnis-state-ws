import { rtk } from './rtk.js';
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
  insert: rtk.createAction<StateEntities>('@core/insert'),

  /**
   * Batch creates entities.
   */
  create: rtk.createAction<StateCreator>('@core/create'),

  /**
   * Batch updates entities.
   */
  update: rtk.createAction<StateUpdater>('@core/update'),

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
