/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  PayloadEntityCreate,
  PayloadEntityUpdate,
} from '@amnis/core/actions';
import type {
  Database,
  Remove,
  ResultCreate,
  ResultDelete,
  ResultRead,
  ResultUpdate,
  Select,
} from '@amnis/core/types';
import { Store } from '@reduxjs/toolkit';
import type {
  ApiProcess,
  ApiProcesses,
  ApiQuery,
} from '../types';

/**
 * Api Handler configurations
 */
export interface ApiCrudProcessesParams {
  store: Store;
  database: Database;
  schemas?: any[],
  definitions?: {
    create?: string,
    read?: string,
    update?: string,
    delete?: string,
  },
  noauth?: boolean;
}

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
export interface ApiCrudProcesses extends ApiProcesses {
  create: ApiProcess<PayloadEntityCreate, ResultCreate>;
  read: ApiProcess<Select, ResultRead>;
  update: ApiProcess<PayloadEntityUpdate, ResultUpdate>;
  delete: ApiProcess<Remove, ResultDelete>;
}
