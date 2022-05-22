import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { entityApiBaseUrl } from './entityApi.const';
import type {
  EntityApiResponseBodyCreate,
  EntityApiResponseBodyRead,
  EntityApiPayloadCreate,
  EntityApiPayloadRead,
} from './entityApi.types';
import {
  entryApiGenerateQueries,
} from './entityApi.queries';

const queries = entryApiGenerateQueries();

export const entityApi = createApi({
  reducerPath: '@amnis/api:entity',
  baseQuery: fetchBaseQuery({
    baseUrl: entityApiBaseUrl,
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
