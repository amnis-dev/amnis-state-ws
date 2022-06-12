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
import { selectors } from '@amnis/core/selectors';
import { apiCrudUrl } from '../const';
import {
  apiCrudQueries,
} from './crud.queries';
import { ApiJSON } from '../types';

global.Headers = Headers;
global.Request = Request;

const queries = apiCrudQueries();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiCrudUrl,
    fetchFn: fetch,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = selectors.selectToken(getState() as State, 'Core', 'access');

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
