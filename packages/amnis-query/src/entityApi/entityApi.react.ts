import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Entity } from '@amnis/core/entity';
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

export const entityApi = createApi({
  reducerPath: '@amnis/api:entity',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlDefault,
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
