import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

const queries = entryApiQueriesGenerate();

export const entityApi = createApi({
  reducerPath: 'api:entity',
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
