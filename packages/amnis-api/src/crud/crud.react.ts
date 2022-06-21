import type { PayloadEntityCreate, PayloadEntityUpdate } from '@amnis/core/actions';
import { selectors } from '@amnis/core/selectors';
import type {
  Remove,
  ResultCreate,
  ResultDelete,
  ResultRead,
  ResultUpdate,
  Select,
  State,
} from '@amnis/core/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CRUD_URL } from '../const';
import { ApiBaseQueryFn, ApiJSON } from '../types';
import {
  apiCrudQueries,
} from './crud.queries';

const queries = apiCrudQueries();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CRUD_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = selectors.selectToken(getState() as State, 'core', 'access');

      if (token && endpoint !== 'refresh') {
        headers.set('Authorization', `Bearer ${token.jwt}`);
      }
      return headers;
    },
  }) as ApiBaseQueryFn,
  endpoints: (builder) => ({
    create: builder.query<
    ApiJSON<ResultCreate>,
    PayloadEntityCreate
    >({
      query: queries.create,
    }),

    read: builder.query<
    ApiJSON<ResultRead>,
    Select
    >({
      query: queries.read,
    }),

    update: builder.query<
    ApiJSON<ResultUpdate>,
    PayloadEntityUpdate
    >({
      query: queries.update,
    }),

    delete: builder.query<
    ApiJSON<ResultDelete>,
    Remove
    >({
      query: queries.delete,
    }),
  }),
});

export default apiCrud;
