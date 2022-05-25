import { createAction } from '@reduxjs/toolkit';
import { entityCreate } from './entity.util';
import { EntityPayloadCreate, EntityPayloadUpdate } from './entity.types';

export const entityActions = {
  create: createAction('entity/create', (entitySliceMap: EntityPayloadCreate) => {
    const entitySliceMapNew = Object.keys(entitySliceMap).reduce<EntityPayloadCreate>(
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

  update: createAction('entity/update', (entitySliceMap: EntityPayloadUpdate) => {
    const entitySliceMapNew = Object.keys(entitySliceMap).reduce<EntityPayloadUpdate>(
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

export default entityActions;
