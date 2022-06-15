---
to: "<%= path ? `${path}/${name}/${name}.react.ts` : null %>"
---
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '../const';
import { ApiJSON, ApiBaseQueryFn } from '../types';
import {
  api<%= Name %>Queries,
} from './<%= name %>.queries';

const queries = api<%= Name %>Queries();

export const api<%= Name %> = createApi({
  reducerPath: 'api<%= Name %>',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }) as ApiBaseQueryFn,
  endpoints: (builder) => ({
    myendpoint: builder.query<
    ApiJSON,
    unknown
    >({
      query: queries.myendpoint,
    }),
  }),
});

export default api<%= Name %>;
