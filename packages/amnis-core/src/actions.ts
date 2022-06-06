import { createAction } from '@reduxjs/toolkit';
import { entityCreate } from './core';
import {
  Entity, EntityExtension, EntityPartial, Remove,
} from './types';

export type PayloadEntityCreate = {
  [slice: string]: EntityExtension<Entity>[];
};

export type PayloadEntityUpdate = {
  [slice: string]: EntityPartial<Entity>[];
};

export const coreActions = {
  create: createAction('@core/entityCreate', (entitySliceMap: PayloadEntityCreate) => {
    const entitySliceMapNew = Object.keys(entitySliceMap).reduce<PayloadEntityCreate>(
      (sliceMap, key) => {
        sliceMap[key] = entitySliceMap[key].map((entity) => (
          entityCreate(key, entity)
        ));
        return sliceMap;
      },
      {},
    );

    return {
      payload: entitySliceMapNew,
    };
  }),

  update: createAction('@core/entityUpdate', (entitySliceMap: PayloadEntityUpdate) => {
    const entitySliceMapNew = Object.keys(entitySliceMap).reduce<PayloadEntityUpdate>(
      (sliceMap, key) => {
        sliceMap[key] = entitySliceMap[key].map((entity) => entityCreate(key, entity));
        return sliceMap;
      },
      {},
    );

    return {
      payload: entitySliceMapNew,
    };
  }),

  delete: createAction('@core/entityDelete', (entitySliceMap: Remove) => ({
    payload: entitySliceMap,
  })),
};

export default coreActions;