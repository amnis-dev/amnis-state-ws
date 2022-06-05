---
to: "<%= path ? `${path}/${name}/${name}.react.ts` : null %>"
---
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '../const';
import { ApiOutput } from '../types';
import {
  api<%= Name %>QueriesSetup,
} from './<%= name %>.queries';

const queries = api<%= Name %>QueriesSetup();

export const api<%= Name %> = createApi({
  reducerPath: 'api<%= Name %>',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  endpoints: (builder) => ({
    myendpoint: builder.query<
    ApiOutput,
    unknown
    >({
      query: queries.myendpoint,
    }),
  }),
});

export default api<%= Name %>;
