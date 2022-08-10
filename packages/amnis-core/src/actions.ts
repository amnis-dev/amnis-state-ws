import { rtk } from './rtk.js';
import type {
  StateCreate,
  StateDelete,
} from './state/index.js';

export const coreActions = {
  create: rtk.createAction<StateCreate>('@core/create'),

  update: rtk.createAction<StateCreate>('@core/update'),

  delete: rtk.createAction<StateDelete>('@core/delete'),
};

export default { coreActions };
