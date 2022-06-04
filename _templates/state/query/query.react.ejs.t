---
to: "<%= path ? `${path}/${name}/${name}.react.ts` : null %>"
---
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '../const';
import { ApiResponse } from '../types';
import {
  api<%= Name %>QueriesSetup,
} from './<%= name %>.queries';

const queries = api<%= Name %>QueriesSetup();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  endpoints: (builder) => ({
    myendpoint: builder.query<
    ApiResponse,
    unknown
    >({
      query: queries.myendpoint,
    }),
  }),
});

export default apiCrud;
