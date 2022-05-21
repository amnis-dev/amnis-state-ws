import type { Entity } from '@amnis/core/entity';
import type { FetchArgs } from '@reduxjs/toolkit/dist/query';
import type {
  EntityApiCreateRequest,
  EntityApiReadRequest,
} from './entityApi.types';

export const entryQueryCreate = (request: EntityApiCreateRequest<Entity>): string | FetchArgs => ({
  url: 'entity/read',
  method: 'post',
  body: request,
});

export const entryQueryRead = (request: EntityApiReadRequest<Entity>): string | FetchArgs => ({
  url: 'entity/read',
  method: 'post',
  body: request,
});

export default { entryQueryRead };
