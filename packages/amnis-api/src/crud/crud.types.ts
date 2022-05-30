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

/**
 * ================================================================================
 * CREATE
 */

/**
 * Create request.
 */
export type ApiCrudRequestCreate = PayloadEntityCreate;

/**
 * Create response.
 */
export type ApiCrudResponseCreate = ResultCreate;

/**
 * ================================================================================
 * READ
 */

/**
 * Read request.
 */
export type ApiCrudRequestRead = Select;

/**
  * Read response.
  */
export type ApiCrudResponseRead = ResultRead;

/**
 * ================================================================================
 * UPDATE
 */

/**
 * Update request.
 */
export type ApiCrudRequestUpdate = PayloadEntityUpdate;

/**
 * Update response.
 */
export type ApiCrudResponseUpdate = ResultUpdate;

/**
 * ================================================================================
 * DELETE
 */

/**
 * Delete request.
 */
export type ApiCrudRequestDelete = PayloadEntityDelete;

/**
  * Delete response.
  */
export type ApiCrudResponseDelete = ResultDelete;
