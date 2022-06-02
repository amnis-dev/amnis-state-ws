import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { PayloadEntityCreate, PayloadEntityUpdate } from '@amnis/core/actions';
import type {
  Remove,
  ResultCreate,
  ResultDelete,
  ResultRead,
  ResultUpdate,
  Select,
  State,
} from '@amnis/core/types';
import fetch, { Headers, Request } from 'cross-fetch';
import { selectToken } from '@amnis/core/selects';
import { apiBaseUrl } from '../const';
import {
  apiQueriesGenerate,
} from './auth.queries';
import { ApiResponse } from '../types';

global.Headers = Headers;
global.Request = Request;

const queries = apiQueriesGenerate();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    fetchFn: fetch,
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
