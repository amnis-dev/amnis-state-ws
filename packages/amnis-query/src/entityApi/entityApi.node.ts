import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { Entity } from '@amnis/core/entity';
import fetch, { Headers, Request } from 'cross-fetch';
import { baseUrlDefault } from '../common';
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
    baseUrl: baseUrlDefault,
    fetchFn: fetch,
  }),
  endpoints: (builder) => ({
    create: builder.query<EntityApiCreateResponse<Entity>, EntityApiCreateRequest<Entity>>({
      query: entryQueryRead,
    }),
    read: builder.query<EntityApiReadResponse<Entity>, EntityApiReadRequest<Entity>>({
      query: entryQueryRead,
    }),
  }),
});

export default entityApi;
