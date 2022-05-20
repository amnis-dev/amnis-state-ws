import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { Entity } from '@amnis/core/entity';
import fetch, { Headers, Request } from 'cross-fetch';
import { baseUrlDefault } from '../common';
import type {
  EntityApiReadResponse,
  EntityApiReadRequest,
} from './entityApi.types';
import {
  entryQueryRead,
} from './entityApiQueries';

global.Headers = Headers;
global.Request = Request;

export const entityApi = createApi({
  reducerPath: 'api:entity',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlDefault,
    fetchFn: fetch,
  }),
  endpoints: (builder) => ({
    read: builder.query<EntityApiReadResponse<Entity>, EntityApiReadRequest<Entity>>({
      query: entryQueryRead,
    }),
  }),
});

export default entityApi;
