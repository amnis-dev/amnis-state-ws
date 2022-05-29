import type { PayloadEntityCreate, PayloadEntityDelete, PayloadEntityUpdate } from '@amnis/core/actions';
import type { Result, Select } from '@amnis/core/types';
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
  create: ApiHandler;
  read: ApiHandler;
  update: ApiHandler;
  delete: ApiHandler;
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
export type ApiCrudResponseCreate = Result;

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
export type ApiCrudResponseRead = Result;

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
export type ApiCrudResponseUpdate = Result;

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
export type ApiCrudResponseDelete = Result;
