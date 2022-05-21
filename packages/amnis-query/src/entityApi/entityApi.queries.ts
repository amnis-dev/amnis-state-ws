import type { FetchArgs } from '@reduxjs/toolkit/dist/query';
import type {
  EntityApiCreateRequest,
  EntityApiReadRequest,
} from './entityApi.types';

export const entryQueryCreate = (request: EntityApiCreateRequest): string | FetchArgs => ({
  url: 'create',
  method: 'post',
  body: request,
});

export const entryQueryRead = (request: EntityApiReadRequest): string | FetchArgs => ({
  url: 'read',
  method: 'post',
  body: request,
});

export default { entryQueryRead };
