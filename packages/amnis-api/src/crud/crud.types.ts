import type {
  PayloadEntityCreate,
  PayloadEntityDelete,
  PayloadEntityUpdate,
} from '@amnis/core/actions';
import type {
  ResultCreate, ResultDelete, ResultRead, ResultUpdate, Select,
} from '@amnis/core/types';
import type { ApiHandler, ApiHandlers, ApiQuery } from '../types';

/**
 * CRUD API relative routes
 */
export type ApiCrudRoutes = 'create' | 'read' | 'update' | 'delete';

/**
 * API object containing request queries.
 */
export interface ApiCrudQueries {
  create: ApiQuery;
  read: ApiQuery;
  update: ApiQuery;
  delete: ApiQuery;
}

/**
 * API object containing response handlers.
 */
export interface ApiCrudHandlers extends ApiHandlers {
  create: ApiHandler<PayloadEntityCreate, ResultCreate>;
  read: ApiHandler<Select, ResultRead>;
  update: ApiHandler<PayloadEntityUpdate, ResultUpdate>;
  delete: ApiHandler<PayloadEntityDelete, ResultDelete>;
}
