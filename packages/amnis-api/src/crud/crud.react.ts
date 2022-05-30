import type { PayloadEntityCreate, PayloadEntityDelete, PayloadEntityUpdate } from '@amnis/core/actions';
import type {
  ResultCreate, ResultDelete, ResultRead, ResultUpdate, Select,
} from '@amnis/core/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '../const';
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
