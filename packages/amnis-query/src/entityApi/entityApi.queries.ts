import { ApiQueries } from '@amnis/core/api';
import type {
  EntityApiPayloadCreate,
  EntityApiPayloadRead,
} from './entityApi.types';

export function entryApiQueriesGenerate(): ApiQueries {
  return {
    create: (payload: EntityApiPayloadCreate) => ({
      url: 'create',
      method: 'post',
      body: payload.body,
    }),
    read: (payload: EntityApiPayloadRead) => ({
      url: 'create',
      method: 'post',
      body: payload.body,
    }),
  };
}

export default entryApiQueriesGenerate;
