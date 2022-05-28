import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from './const';
import type {
  ApiPayload,
  ApiRequestBodyDispatch,
  ApiRequestBodySelect,
  ApiResponseBodyDispatch,
  ApiResponseBodySelect,
} from './types';
import {
  apiQueriesGenerate,
} from './queries';

const queries = apiQueriesGenerate();

export const apiRedux = createApi({
  reducerPath: 'apiRedux',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  endpoints: (builder) => ({
    dispatch: builder.query<
    ApiResponseBodyDispatch,
    ApiPayload<ApiRequestBodyDispatch>
    >({
      query: queries.dispatch,
    }),
    select: builder.query<
    ApiResponseBodySelect,
    ApiPayload<ApiRequestBodySelect>
    >({
      query: queries.select,
    }),
  }),
});

export default apiRedux;
