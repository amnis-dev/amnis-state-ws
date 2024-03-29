---
to: "<%= path ? `${path}/${name}/${name}.node.ts` : null %>"
---
import fetch, { Headers, Request } from 'cross-fetch';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { apiBaseUrl } from '../config.js';
import {
  api<%= Name %>Queries,
} from './<%= name %>.queries';
import { ApiJSON, ApiBaseQueryFn } from '../types.js';

global.Headers = Headers;
global.Request = Request;

const queries = api<%= Name %>Queries();

export const api<%= Name %> = createApi({
  reducerPath: 'api<%= Name %>',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    fetchFn: fetch,
  }) as as ApiBaseQueryFn,
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
