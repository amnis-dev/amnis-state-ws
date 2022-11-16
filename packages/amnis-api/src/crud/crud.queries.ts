/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions.js';
import {
  Entity,
  EntityCreator,
  entityKeys,
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
      body: Object.keys(payload).reduce<StateCreator>((acc, key) => {
        payload[key].forEach((entity) => {
          const entityNew = Object.keys(entity).reduce<EntityCreator<Entity>>((accE, keyE) => {
            if (keyE === '$id' && !entityKeys.includes(keyE)) {
              accE[keyE] = entity[keyE];
            }
            return accE;
          }, {} as EntityCreator<Entity>);

          if (!acc[key]) { acc[key] = []; }
          acc[key].push(entityNew);
        });
        return acc;
      }, {}),
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
