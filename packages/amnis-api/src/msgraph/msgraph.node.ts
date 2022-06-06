import fetch, { Headers, Request } from 'cross-fetch';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { apiBaseUrl } from '../const';
import {
  apiMSGraphQueries,
} from './msgraph.queries';
import { ApiJSON } from '../types';

global.Headers = Headers;
global.Request = Request;

const queries = apiMSGraphQueries();

export const apiMSGraph = createApi({
  reducerPath: 'apiMSGraph',
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

export default apiMSGraph;
