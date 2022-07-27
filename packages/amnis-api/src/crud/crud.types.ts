/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  StateDelete,
  StateCreate,
  StateUpdate,
  StateQuery,
} from '@amnis/core/state';
import type {
  ApiIO,
  ApiProcess,
  ApiProcesses,
  ApiQuery,
} from '../types';

/**
 * API object containing request queries.
 */
export interface ApiCrudQueries {
  create: ApiQuery;
  read: ApiQuery;
  update: ApiQuery;
  delete: ApiQuery;
}

export type ApiCrudIOCreate = ApiIO<StateCreate, StateCreate>;
export type ApiCrudIORead = ApiIO<StateQuery, StateCreate>;
export type ApiCrudIOUpdate = ApiIO<StateUpdate, StateCreate>;
export type ApiCrudIODelete = ApiIO<StateDelete, StateDelete>;

/**
 * API object containing response handlers.
 */
export interface ApiCrudProcesses extends ApiProcesses {
  create: ApiProcess<ApiCrudIOCreate>;
  read: ApiProcess<ApiCrudIORead>;
  update: ApiProcess<ApiCrudIOUpdate>;
  delete: ApiProcess<ApiCrudIODelete>;
}
