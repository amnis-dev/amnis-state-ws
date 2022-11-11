import { rtk } from './rtk.js';
import type {
  StateCreate,
  StateDelete,
} from './state/index.js';

export const coreActions = {
  /**
   * Batch creates entities.
   */
  create: rtk.createAction<StateCreate>('@core/create'),

  /**
   * Batch updates entities.
   */
  update: rtk.createAction<StateCreate>('@core/update'),

  /**
   * Batch deletes entities.
   */
  delete: rtk.createAction<StateDelete>('@core/delete'),

  /**
   * Wipes all entities from the state.
   */
  wipe: rtk.createAction('@core/wipe'),
};

export default { coreActions };
