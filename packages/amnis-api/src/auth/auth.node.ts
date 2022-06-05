import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import fetch, { Headers, Request } from 'cross-fetch';
import { apiBaseUrl } from '../const';
import {
  apiQueries,
} from './auth.queries';
import { ApiOutput } from '../types';

global.Headers = Headers;
global.Request = Request;

const queries = apiQueries();

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    fetchFn: fetch,
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

export default apiAuth;
