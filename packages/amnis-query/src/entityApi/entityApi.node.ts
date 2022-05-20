import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { Entity } from '@amnis/core/entity.types';
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
  reducerPath: 'entityApi',
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
