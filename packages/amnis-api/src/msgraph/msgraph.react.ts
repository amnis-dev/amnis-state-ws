import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '../const';
import { ApiResponse } from '../types';
import {
  apiMSGraphQueriesSetup,
} from './msgraph.queries';

const queries = apiMSGraphQueriesSetup();

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
