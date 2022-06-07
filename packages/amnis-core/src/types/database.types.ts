/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Insert,
  Modify,
  Remove,
  ResultCreate, ResultDelete, ResultRead, ResultUpdate, Select,
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
  create: (state: Insert) => ResultCreate;

  /**
   * Method for updating records in the database.
   */
  update: (state: Modify) => ResultUpdate;

  /**
   * Method to delete records in the database.
   * Shouldn't actually delete records, but mark them as deleted instead
   */
  delete: (references: Remove) => ResultDelete;

  /**
   * Selects data from the database determined by the select query.
   */
  read: (select: Select) => ResultRead;
}
