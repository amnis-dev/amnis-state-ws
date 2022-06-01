import type {
  PayloadEntityCreate,
  PayloadEntityUpdate,
} from '@amnis/core/actions';
import type { Remove, Select } from '@amnis/core/types';
import type {
  ApiCrudQueries,
} from './crud.types';

export function apiQueriesGenerate(): ApiCrudQueries {
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
      method: 'delete',
      body: payload,
    }),
  };
}

export default apiQueriesGenerate;
