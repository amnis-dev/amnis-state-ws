/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Entity, Reference, Select, State, Result,
} from '../types';

export interface Database {
  initialize: (...params: any[]) => void;
  create: (state: State) => Result;
  update: (state: State) => Result;
  delete: (references: Record<string, Reference>) => Result;
  select: (select: Select) => Result;
}
