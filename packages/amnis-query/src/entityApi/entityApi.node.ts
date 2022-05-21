import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import fetch, { Headers, Request } from 'cross-fetch';
import { entityApiBaseUrl } from './entityApi.const';
import type {
  EntityApiCreateResponse,
  EntityApiCreateRequest,
  EntityApiReadResponse,
  EntityApiReadRequest,
} from './entityApi.types';
import {
  entryQueryRead,
} from './entityApi.queries';

global.Headers = Headers;
global.Request = Request;

export const entityApi = createApi({
  reducerPath: '@amnis/api:entity',
  baseQuery: fetchBaseQuery({
    baseUrl: entityApiBaseUrl,
    fetchFn: fetch,
  }),
  endpoints: (builder) => ({
    create: builder.query<EntityApiCreateResponse, EntityApiCreateRequest>({
      query: entryQueryRead,
    }),
    read: builder.query<EntityApiReadResponse, EntityApiReadRequest>({
      query: entryQueryRead,
    }),
  }),
});

export default entityApi;
