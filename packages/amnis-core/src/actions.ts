import { createAction } from '@reduxjs/toolkit';
import { entityCreate } from './core';
import { Entity, EntityExtension, EntityPartial } from './types';

export type PayloadEntityCreate = {
  [slice: string]: EntityExtension<Entity>[]
};

export type PayloadEntityUpdate = {
  [slice: string]: EntityPartial<Entity>[]
};

export const coreActions = {
  create: createAction('@core/entityCreate', (entitySliceMap: PayloadEntityCreate) => {
    const entitySliceMapNew = Object.keys(entitySliceMap).reduce<PayloadEntityCreate>(
      (sliceMap, key) => {
        sliceMap[key] = entitySliceMap[key].map((entity) => entityCreate(entity));
        return sliceMap;
      },
      {},
    );

    return {
      payload: entitySliceMapNew,
    };
  }),

  update: createAction('@core/entityModify', (entitySliceMap: PayloadEntityUpdate) => {
    const entitySliceMapNew = Object.keys(entitySliceMap).reduce<PayloadEntityUpdate>(
      (sliceMap, key) => {
        sliceMap[key] = entitySliceMap[key].map((entity) => entityCreate(entity));
        return sliceMap;
      },
      {},
    );

    return {
      payload: entitySliceMapNew,
    };
  }),
};

export default coreActions;
