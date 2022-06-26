import type {
  PayloadEntityCreate,
  PayloadEntityUpdate,
} from '@amnis/core/actions';
import type { Remove, Select } from '@amnis/core/state';
import type {
  ApiCrudQueries,
} from './crud.types';

export function apiCrudQueries(): ApiCrudQueries {
  return {
    create: (payload: PayloadEntityCreate) => ({
      url: 'create',
      method: 'post',
      body: payload,
    }),
    read: (payload: Select) => ({
      url: 'read',
      method: 'post',
      body: payload,
    }),
    update: (payload: PayloadEntityUpdate) => ({
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
