import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { PayloadEntityCreate, PayloadEntityDelete, PayloadEntityUpdate } from '@amnis/core/actions';
import type {
  ResultCreate, ResultDelete, ResultRead, ResultUpdate, Select,
} from '@amnis/core/types';
import fetch, { Headers, Request } from 'cross-fetch';
import { apiBaseUrl } from '../const';
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
    ResultCreate,
    PayloadEntityCreate
    >({
      query: queries.create,
    }),

    read: builder.query<
    ResultRead,
    Select
    >({
      query: queries.read,
    }),

    update: builder.query<
    ResultUpdate,
    PayloadEntityUpdate
    >({
      query: queries.create,
    }),

    delete: builder.query<
    ResultDelete,
    PayloadEntityDelete
    >({
      query: queries.create,
    }),
  }),
});

export default apiCrud;
