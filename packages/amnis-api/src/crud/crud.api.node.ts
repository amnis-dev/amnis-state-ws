import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { PayloadEntityCreate, PayloadEntityUpdate } from '@amnis/core/actions';
import type {
  Remove,
  StateCreate,
  StateDelete,
  StateRead,
  StateUpdate,
  Select,
  State,
} from '@amnis/core/state';
import fetch, { Headers, Request } from 'cross-fetch';
import { selectors } from '@amnis/core/selectors';
import { apiConfig } from '../config';
import {
  apiCrudQueries,
} from './crud.queries';
import { ApiBaseQueryFn, ApiJSON } from '../types';

global.Headers = Headers;
global.Request = Request;

const queries = apiCrudQueries();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_CRUD_URL,
    fetchFn: fetch,
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
    ApiJSON<StateCreate>,
    PayloadEntityCreate
    >({
      query: queries.create,
    }),

    read: builder.query<
    ApiJSON<StateRead>,
    Select
    >({
      query: queries.read,
    }),

    update: builder.query<
    ApiJSON<StateUpdate>,
    PayloadEntityUpdate
    >({
      query: queries.update,
    }),

    delete: builder.query<
    ApiJSON<StateDelete>,
    Remove
    >({
      query: queries.delete,
    }),
  }),
});

export default apiCrud;
