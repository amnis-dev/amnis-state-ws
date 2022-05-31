import type {
  PayloadEntityCreate,
  PayloadEntityDelete,
  PayloadEntityUpdate,
} from '@amnis/core/actions';
import type {
  ResultCreate, ResultDelete, ResultRead, ResultUpdate, Select,
} from '@amnis/core/types';
import type {
  ApiHandler, ApiHandlers, ApiQuery, ApiResponse,
} from '../types';

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
  create: ApiHandler<PayloadEntityCreate, ApiResponse<ResultCreate>>;
  read: ApiHandler<Select, ApiResponse<ResultRead>>;
  update: ApiHandler<PayloadEntityUpdate, ApiResponse<ResultUpdate>>;
  delete: ApiHandler<PayloadEntityDelete, ApiResponse<ResultDelete>>;
}
