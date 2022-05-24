import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiPayload } from '@amnis/core/api';
import { stateApiBaseUrl } from './stateApi.const';
import type {
  StateApiRequestBodyDispatch,
  StateApiRequestBodySelect,
  StateApiResponseBodyDispatch,
  StateApiResponseBodySelect,
} from './stateApi.types';
import {
  stateApiQueriesGenerate,
} from './stateApi.queries';

const queries = stateApiQueriesGenerate();

export const stateApi = createApi({
  reducerPath: 'api:state',
  baseQuery: fetchBaseQuery({
    baseUrl: stateApiBaseUrl,
  }),
  endpoints: (builder) => ({
    dispatch: builder.query<
    StateApiResponseBodyDispatch,
    ApiPayload<StateApiRequestBodyDispatch>
    >({
      query: queries.dispatch,
    }),
    select: builder.query<
    StateApiResponseBodySelect,
    ApiPayload<StateApiRequestBodySelect>
    >({
      query: queries.select,
    }),
  }),
});

export default stateApi;
