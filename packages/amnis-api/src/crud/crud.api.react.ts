import type { PayloadEntityCreate, PayloadEntityUpdate } from '@amnis/core/actions';
import { selectors } from '@amnis/core/selectors';
import type {
  Remove,
  StateCreate,
  StateDelete,
  StateRead,
  StateUpdate,
  Select,
  State,
} from '@amnis/core/state';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiConfig } from '../config';
import { ApiBaseQueryFn, ApiJSON } from '../types';
import {
  apiCrudQueries,
} from './crud.queries';

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