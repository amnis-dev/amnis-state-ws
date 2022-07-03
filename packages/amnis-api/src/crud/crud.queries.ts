import type {
  Remove, Select, StateCreate, StateUpdate,
} from '@amnis/core/state';
import type {
  ApiCrudQueries,
} from './crud.types';

export function apiCrudQueries(): ApiCrudQueries {
  return {
    create: (payload: StateCreate) => ({
      url: 'create',
      method: 'post',
      body: payload,
    }),
    read: (payload: Select) => ({
      url: 'read',
      method: 'post',
      body: payload,
    }),
    update: (payload: StateUpdate) => ({
      url: 'update',
      method: 'post',
      body: payload,
    }),
    delete: (payload: Remove) => ({
      url: 'delete',
      method: 'post',
      body: payload,
    }),
  };
}

export default apiCrudQueries;
