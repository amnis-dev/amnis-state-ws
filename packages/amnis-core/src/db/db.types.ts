/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Reference, Select, State, Result,
} from '../types';

export interface Database {
  /**
   * Method to implement database initialization.
   */
  initialize: (...params: any[]) => void;

  /**
   * Method for creating new records in the database.
   */
  create: (state: State) => Result;

  /**
   * Method for updating records in the database.
   */
  update: (state: State) => Result;

  /**
   * Method to delete records in the database.
   * Shouldn't actually delete records, but mark them as deleted instead
   */
  delete: (references: Record<string, Reference[]>) => Result;

  /**
   * Selects data from the database determined by the select query.
   */
  select: (select: Select) => Result;
}
