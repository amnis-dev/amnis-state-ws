import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '../const';
import { ApiOutput } from '../types';
import {
  apiMSGraphQueriesSetup,
} from './msgraph.queries';

const queries = apiMSGraphQueriesSetup();

export const apiMSGraph = createApi({
  reducerPath: 'apiMSGraph',
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

export default apiMSGraph;
