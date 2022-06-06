---
to: "<%= path ? `${path}/${name}/${name}.node.ts` : null %>"
---
import fetch, { Headers, Request } from 'cross-fetch';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { apiBaseUrl } from '../const';
import {
  api<%= Name %>Queries,
} from './<%= name %>.queries';
import { ApiJSON } from '../types';

global.Headers = Headers;
global.Request = Request;

const queries = api<%= Name %>Queries();

export const api<%= Name %> = createApi({
  reducerPath: 'api<%= Name %>',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    fetchFn: fetch,
  }),
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
