import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

export const entityApi = createApi({
  reducerPath: '@amnis/api:entity',
  baseQuery: fetchBaseQuery({
    baseUrl: entityApiBaseUrl,
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
