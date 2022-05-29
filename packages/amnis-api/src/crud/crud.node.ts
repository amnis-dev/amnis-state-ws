import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import fetch, { Headers, Request } from 'cross-fetch';
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

global.Headers = Headers;
global.Request = Request;

const queries = apiQueriesGenerate();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    fetchFn: fetch,
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
