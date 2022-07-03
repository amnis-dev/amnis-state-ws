/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reference } from '@amnis/core/types';
import type { AuthScope } from '@amnis/auth/types';
import type {
  Insert,
  Modify,
  Remove,
  StateCreate,
  StateDelete,
  Select,
} from '@amnis/core/state';

export type DatabaseCreateMethod = (
  state: Insert,
  scope?: AuthScope,
  subject?: Reference
) => Promise<StateCreate>;

export type DatabaseReadMethod = (
  select: Select,
  scope?: AuthScope,
  subject?: Reference
) => Promise<StateCreate>;

export type DatabaseUpdateMethod = (
  state: Modify,
  scope?: AuthScope,
  subject?: Reference
) => Promise<StateCreate>;

export type DatabaseDeleteMethod = (
  references: Remove,
  scope?: AuthScope,
  subject?: Reference
) => Promise<StateDelete>;

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
