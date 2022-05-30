import type {
  ApiCrudQueries,
  ApiCrudRequestCreate,
  ApiCrudRequestDelete,
  ApiCrudRequestRead,
  ApiCrudRequestUpdate,
} from './crud.types';

export function apiQueriesGenerate(): ApiCrudQueries {
  return {
    create: (payload: ApiCrudRequestCreate) => ({
      url: 'create',
      method: 'post',
      body: payload,
    }),
    read: (payload: ApiCrudRequestDelete) => ({
      url: 'read',
      method: 'post',
      body: payload,
    }),
    update: (payload: ApiCrudRequestRead) => ({
      url: 'update',
      method: 'post',
      body: payload,
    }),
    delete: (payload: ApiCrudRequestUpdate) => ({
      url: 'delete',
      method: 'delete',
      body: payload,
    }),
  };
}

export default apiQueriesGenerate;
