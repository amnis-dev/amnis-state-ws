/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ResultCreate, ResultDelete, ResultRead, ResultUpdate, Select, State,
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
  create: (state: State) => ResultCreate;

  /**
   * Method for updating records in the database.
   */
  update: (state: State) => ResultUpdate;

  /**
   * Method to delete records in the database.
   * Shouldn't actually delete records, but mark them as deleted instead
   */
  delete: (references: State<string[]>) => ResultDelete;

  /**
   * Selects data from the database determined by the select query.
   */
  read: (select: Select) => ResultRead;
}
