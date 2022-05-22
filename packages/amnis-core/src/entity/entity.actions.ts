import { createAction } from '@reduxjs/toolkit';
import { EntityPayloadCreate } from './entity.types';

export const entityActions = {
  create: createAction<EntityPayloadCreate>('@amnis/entity/create'),
};

export default entityActions;
