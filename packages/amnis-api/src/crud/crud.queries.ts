/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import {
  IoOutputJson,
  StateCreator,
  StateDeleter,
  StateEntities,
  StateQuery,
  StateUpdater,
} from '@amnis/core';

export const apiCrudQueries = <T extends EndpointBuilder<any, any, any>>(builder: T) => ({
  create: builder.mutation<
  IoOutputJson<StateEntities>,
  StateCreator
  >({
    query: (payload) => ({
      url: 'create',
      method: 'post',
      body: payload,
    }),
  }),

  read: builder.query<
  IoOutputJson<StateEntities>,
  StateQuery
  >({
    query: (payload) => ({
      url: 'read',
      method: 'post',
      body: payload,
    }),
  }),

  update: builder.mutation<
  IoOutputJson<StateEntities>,
  StateUpdater
  >({
    query: (payload) => ({
      url: 'update',
      method: 'post',
      body: payload,
    }),
  }),

  delete: builder.mutation<
  IoOutputJson<StateDeleter>,
  StateDeleter
  >({
    query: (payload) => ({
      url: 'delete',
      method: 'post',
      body: payload,
    }),
  }),
});
export default apiCrudQueries;
