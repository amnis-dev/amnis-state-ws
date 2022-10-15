import type {
  StateDelete, StateQuery, StateCreate, StateUpdate,
} from '@amnis/core/state/index.js';
import type {
  ApiCrudQueries,
} from './crud.types.js';

export function apiCrudQueries(): ApiCrudQueries {
  return {
    create: (payload: StateCreate) => ({
      url: 'create',
      method: 'post',
      body: payload,
    }),
    read: (payload: StateQuery) => ({
      url: 'read',
      method: 'post',
      body: payload,
    }),
    update: (payload: StateUpdate) => ({
      url: 'update',
      method: 'post',
      body: payload,
    }),
    delete: (payload: StateDelete) => ({
      url: 'delete',
      method: 'post',
      body: payload,
    }),
  };
}

export default apiCrudQueries;
