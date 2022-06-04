---
to: "<%= path ? `${path}/${name}/${name}.node.ts` : null %>"
---
import fetch, { Headers, Request } from 'cross-fetch';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { apiBaseUrl } from '../const';
import {
  api<%= Name %>QueriesSetup,
} from './<%= name %>.queries';
import { ApiResponse } from '../types';

global.Headers = Headers;
global.Request = Request;

const queries = api<%= Name %>QueriesSetup();

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    fetchFn: fetch,
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
