/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthScope } from './auth.types';
import { Reference } from './core.types';
import type {
  Insert,
  Modify,
  Remove,
  ResultCreate,
  ResultDelete,
  ResultRead,
  ResultUpdate,
  Select,
} from './state.types';

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
  create: (state: Insert, scope?: AuthScope, subject?: Reference) => ResultCreate;

  /**
   * Method for updating records in the database.
   */
  update: (state: Modify, scope?: AuthScope, subject?: Reference) => ResultUpdate;

  /**
   * Method to delete records in the database.
   * Shouldn't actually delete records, but mark them as deleted instead.
   */
  delete: (references: Remove, scope?: AuthScope, subject?: Reference) => ResultDelete;

  /**
   * Selects data from the database determined by the select query.
   */
  read: (select: Select, scope?: AuthScope, subject?: Reference) => ResultRead;
}
