import { createAction } from '@reduxjs/toolkit';
import type {
  StateCreate,
  StateDelete,
} from './state';

export const coreActions = {
  create: createAction<StateCreate>('@core/create'),

  update: createAction<StateCreate>('@core/update'),

  delete: createAction<StateDelete>('@core/delete'),
};

export default { coreActions };
