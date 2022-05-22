import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import fetch, { Headers, Request } from 'cross-fetch';
import { entityApiBaseUrl } from './entityApi.const';
import type {
  EntityApiResponseBodyCreate,
  EntityApiResponseBodyRead,
  EntityApiPayloadCreate,
  EntityApiPayloadRead,
} from './entityApi.types';
import {
  entryApiQueriesGenerate,
} from './entityApi.queries';

global.Headers = Headers;
global.Request = Request;

const queries = entryApiQueriesGenerate();

export const entityApi = createApi({
  reducerPath: '@amnis/api:entity',
  baseQuery: fetchBaseQuery({
    baseUrl: entityApiBaseUrl,
    fetchFn: fetch,
  }),
  endpoints: (builder) => ({
    create: builder.query<EntityApiResponseBodyCreate, EntityApiPayloadCreate>({
      query: queries.create,
    }),
    read: builder.query<EntityApiResponseBodyRead, EntityApiPayloadRead>({
      query: queries.read,
    }),
  }),
});

export default entityApi;
