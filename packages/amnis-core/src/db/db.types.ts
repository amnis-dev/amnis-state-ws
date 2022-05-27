/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Entity } from '../entity/entity.types';
import type { Reference, Select, State } from '../core.types';

export interface Database {
  initialize: (...params: any[]) => void;
  create: (store: State) => boolean;
  update: (store: State) => boolean;
  delete: (references: Record<string, Reference>) => boolean;
  select: (select: Select) => Record<string, Entity[]>;
}
