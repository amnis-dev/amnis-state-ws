import type { Entity } from '@amnis/core/entity.types';
import type { FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { EntityApiReadRequest } from './entityApi.types';

export const entryQueryRead = (request: EntityApiReadRequest<Entity>): string | FetchArgs => ({
  url: 'entity/read',
  method: 'post',
  body: request,
});

export default { entryQueryRead };
