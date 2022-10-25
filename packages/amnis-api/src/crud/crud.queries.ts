/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions.js';
import {
  IoOutputJson,
  StateCreate,
  StateDelete,
  StateQuery,
  StateUpdate,
} from '@amnis/core';

export const apiCrudQueries = <T extends EndpointBuilder<any, any, any>>(builder: T) => ({
  create: builder.query<
  IoOutputJson<StateCreate>,
  StateCreate
  >({
    query: (payload: StateCreate) => ({
      url: 'create',
      method: 'post',
      body: payload,
    }),
  }),

  read: builder.query<
  IoOutputJson<StateCreate>,
  StateQuery
  >({
    query: (payload: StateQuery) => ({
      url: 'read',
      method: 'post',
      body: payload,
    }),
  }),

  update: builder.query<
  IoOutputJson<StateCreate>,
  StateUpdate
  >({
    query: (payload: StateUpdate) => ({
      url: 'update',
      method: 'post',
      body: payload,
    }),
  }),

  delete: builder.query<
  IoOutputJson<StateDelete>,
  StateDelete
  >({
    query: (payload: StateDelete) => ({
      url: 'delete',
      method: 'post',
      body: payload,
    }),
  }),
});
export default apiCrudQueries;
