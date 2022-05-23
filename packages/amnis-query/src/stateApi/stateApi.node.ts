import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import fetch, { Headers, Request } from 'cross-fetch';
import { ApiPayload } from '@amnis/core/api';
import { stateApiBaseUrl } from './stateApi.const';
import type {
  StateApiResponseBodyDispatch,
  StateApiRequestBodyDispatch,
} from './stateApi.types';
import {
  stateApiQueriesGenerate,
} from './stateApi.queries';

global.Headers = Headers;
global.Request = Request;

const queries = stateApiQueriesGenerate();

export const stateApi = createApi({
  reducerPath: 'api:state',
  baseQuery: fetchBaseQuery({
    baseUrl: stateApiBaseUrl,
    fetchFn: fetch,
  }),
  endpoints: (builder) => ({
    dispatch: builder.query<
    StateApiResponseBodyDispatch,
    ApiPayload<StateApiRequestBodyDispatch>
    >({
      query: queries.dispatch,
    }),
  }),
});

export default stateApi;
