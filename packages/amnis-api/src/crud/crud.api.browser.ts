import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import type {
  StateDelete,
  StateCreate,
  StateUpdate,
  StateQuery,
  State,
} from '@amnis/core/state';
import { selectors } from '@amnis/core/selectors';
import { apiConfig } from '../config';
import {
  apiCrudQueries,
} from './crud.queries';
import { ApiBaseQueryFn, ApiJSON } from '../types';

const queries = apiCrudQueries();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_CRUD_URL,
    fetchFn: fetch || (() => undefined),
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
