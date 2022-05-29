import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '../const';
import type {
  ApiCrudRequestCreate,
  ApiCrudRequestDelete,
  ApiCrudRequestRead,
  ApiCrudRequestUpdate,
  ApiCrudResponseCreate,
  ApiCrudResponseDelete,
  ApiCrudResponseRead,
  ApiCrudResponseUpdate,
} from './crud.types';
import {
  apiQueriesGenerate,
} from './crud.queries';

const queries = apiQueriesGenerate();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  endpoints: (builder) => ({
    create: builder.query<
    ApiCrudResponseCreate,
    ApiCrudRequestCreate
    >({
      query: queries.create,
    }),

    read: builder.query<
    ApiCrudResponseRead,
    ApiCrudRequestRead
    >({
      query: queries.read,
    }),

    update: builder.query<
    ApiCrudResponseUpdate,
    ApiCrudRequestUpdate
    >({
      query: queries.create,
    }),

    delete: builder.query<
    ApiCrudResponseDelete,
    ApiCrudRequestDelete
    >({
      query: queries.create,
    }),
  }),
});

export default apiCrud;
