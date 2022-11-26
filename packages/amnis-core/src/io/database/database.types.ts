/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UID } from '../../types.js';
import type {
  StateScope,
  StateUpdater,
  StateDeleter,
  StateQuery,
  StateEntities,
} from '../../state/index.js';

export interface DatabaseControls {
  scope?: StateScope;
  subject?: UID;
}

export type DatabaseCreateMethod = (
  state: StateEntities,
  controls?: DatabaseControls
) => Promise<StateEntities>;

export type DatabaseReadMethod = (
  select: StateQuery,
  controls?: DatabaseControls
) => Promise<StateEntities>;

export type DatabaseUpdateMethod = (
  state: StateUpdater,
  controls?: DatabaseControls
) => Promise<StateEntities>;

export type DatabaseDeleteMethod = (
  references: StateDeleter,
  controls?: DatabaseControls
) => Promise<StateDeleter>;

/**
 * Core interface for database methods.
 */
export interface Database {
  /**
   * Method to implement database initialization.
   */
  initialize: (...params: any[]) => void;

  /**
   * Method for creating new records in the database.
   */
  create: DatabaseCreateMethod;

  /**
   * Selects data from the database determined by the select query.
   */
  read: DatabaseReadMethod;

  /**
   * Method for updating records in the database.
   */
  update: DatabaseUpdateMethod;

  /**
   * Method to delete records in the database.
   * Shouldn't actually delete records, but mark them as deleted instead.
   */
  delete: DatabaseDeleteMethod;
}
