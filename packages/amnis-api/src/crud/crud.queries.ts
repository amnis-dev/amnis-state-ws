/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions.js';
import {
  Entity,
  EntityCreate,
  entityKeys,
  IoOutputJson,
  StateCreate,
  StateDelete,
  StateQuery,
  StateUpdate,
} from '@amnis/core';

export const apiCrudQueries = <T extends EndpointBuilder<any, any, any>>(builder: T) => ({
  create: builder.mutation<
  IoOutputJson<StateCreate>,
  StateCreate
  >({
    query: (payload: StateCreate) => ({
      url: 'create',
      method: 'post',
      body: Object.keys(payload).reduce<StateCreate>((acc, key) => {
        payload[key].forEach((entity) => {
          const entityNew = Object.keys(entity).reduce<EntityCreate<Entity>>((accE, keyE) => {
            if (keyE === '$id' && !entityKeys.includes(keyE)) {
              accE[keyE] = entity[keyE];
            }
            return accE;
          }, {} as EntityCreate<Entity>);

          if (!acc[key]) { acc[key] = []; }
          acc[key].push(entityNew);
        });
        return acc;
      }, {}),
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

  update: builder.mutation<
  IoOutputJson<StateCreate>,
  StateUpdate
  >({
    query: (payload: StateUpdate) => ({
      url: 'update',
      method: 'post',
      body: payload,
    }),
  }),

  delete: builder.mutation<
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
