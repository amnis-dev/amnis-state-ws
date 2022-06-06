import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '../const';
import { ApiOutput } from '../types';
import {
  apiQueries,
} from './auth.queries';

const queries = apiQueries();

export const apiCrud = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  endpoints: (builder) => ({
    authorize: builder.query<
    ApiOutput,
    unknown
    >({
      query: queries.authorize,
    }),
  }),
});

export default apiCrud;