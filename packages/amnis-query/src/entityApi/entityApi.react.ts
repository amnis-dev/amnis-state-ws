import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Entity } from '@amnis/core/entity.types';
import { baseUrlDefault } from '../common';
import type {
  EntityApiReadResponse,
  EntityApiReadRequest,
} from './entityApi.types';
import {
  entryQueryRead,
} from './entityApiQueries';

export const entityApi = createApi({
  reducerPath: 'entityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlDefault,
  }),
  endpoints: (builder) => ({
    read: builder.query<EntityApiReadResponse<Entity>, EntityApiReadRequest<Entity>>({
      query: entryQueryRead,
    }),
  }),
});

export default entityApi;
