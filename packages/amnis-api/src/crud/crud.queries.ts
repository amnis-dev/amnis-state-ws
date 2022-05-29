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
      url: 'crud/create',
      method: 'post',
      body: payload,
    }),
    read: (payload: ApiCrudRequestDelete) => ({
      url: 'crud/read',
      method: 'post',
      body: payload,
    }),
    update: (payload: ApiCrudRequestRead) => ({
      url: 'crud/update',
      method: 'post',
      body: payload,
    }),
    delete: (payload: ApiCrudRequestUpdate) => ({
      url: 'crud/delete',
      method: 'delete',
      body: payload,
    }),
  };
}

export default apiQueriesGenerate;
