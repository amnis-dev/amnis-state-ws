import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/index.js';
import type {
  StateDelete,
  StateCreate,
  StateUpdate,
  StateQuery,
  State,
} from '@amnis/core/state/index.js';
import { selectors } from '@amnis/core/selectors.js';
import { apiConfig } from '../config.js';
import {
  apiCrudQueries,
} from './crud.queries.js';
import { ApiBaseQueryFn, ApiJSON } from '../types.js';

const queries = apiCrudQueries();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_CRUD_URL,
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
    StateCreate
    >({
      query: queries.create,
    }),

    read: builder.query<
    ApiJSON<StateCreate>,
    StateQuery
    >({
      query: queries.read,
    }),

    update: builder.query<
    ApiJSON<StateCreate>,
    StateUpdate
    >({
      query: queries.update,
    }),

    delete: builder.query<
    ApiJSON<StateDelete>,
    StateDelete
    >({
      query: queries.delete,
    }),
  }),
});

export default apiCrud;
