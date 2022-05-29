import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import fetch, { Headers, Request } from 'cross-fetch';
import { apiBaseUrl } from './const';
import type {
  ApiPayload,
  ApiResponseBodyDispatch,
  ApiRequestBodyDispatch,
  ApiResponseBodySelect,
  ApiRequestBodySelect,
} from './types';
import {
  apiQueriesGenerate,
} from './queries';

global.Headers = Headers;
global.Request = Request;

const queries = apiQueriesGenerate();

export const apiRedux = createApi({
  reducerPath: 'apiRedux',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    fetchFn: fetch,
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
