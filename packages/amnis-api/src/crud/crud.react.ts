import type { PayloadEntityCreate, PayloadEntityUpdate } from '@amnis/core/actions';
import { selectToken } from '@amnis/core/selects';
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
import { apiCrudUrl } from '../const';
import { ApiJSON } from '../types';
import {
  apiCrudQueries,
} from './crud.queries';

const queries = apiCrudQueries();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiCrudUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = selectToken(getState() as State, 'Core', 'access');

      if (token && endpoint !== 'refresh') {
        headers.set('Authorization', `Bearer ${token.jwt}`);
      }
      return headers;
    },
  }),
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
      query: queries.create,
    }),

    delete: builder.query<
    ApiJSON<ResultDelete>,
    Remove
    >({
      query: queries.create,
    }),
  }),
});

export default apiCrud;
