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
import { apiBaseUrl } from '../const';
import { ApiResponse } from '../types';
import {
  apiQueriesGenerate,
} from './msgraph.queries';

const queries = apiQueriesGenerate();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = selectToken(getState() as State, 'Core', 'access');

      if (token && endpoint !== 'refresh') {
        headers.set('Authorization', `Bearer ${token.encoding}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    create: builder.query<
    ApiResponse<ResultCreate>,
    PayloadEntityCreate
    >({
      query: queries.create,
    }),

    read: builder.query<
    ApiResponse<ResultRead>,
    Select
    >({
      query: queries.read,
    }),

    update: builder.query<
    ApiResponse<ResultUpdate>,
    PayloadEntityUpdate
    >({
      query: queries.create,
    }),

    delete: builder.query<
    ApiResponse<ResultDelete>,
    Remove
    >({
      query: queries.create,
    }),
  }),
});

export default apiCrud;
