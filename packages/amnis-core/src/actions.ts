import { createAction } from '@reduxjs/toolkit';
import type {
  StateCreate,
  StateUpdate,
  StateDelete,
} from './state';

export const coreActions = {
  create: createAction<StateCreate>('@core/create'),

  update: createAction<StateUpdate>('@core/update'),

  delete: createAction<StateDelete>('@core/delete'),
};

export default { coreActions };
