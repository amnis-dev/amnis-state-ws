import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '../const';
import { ApiJSON } from '../types';
import {
  apiMSGraphQueries,
} from './msgraph.queries';

const queries = apiMSGraphQueries();

export const apiMSGraph = createApi({
  reducerPath: 'apiMSGraph',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
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
