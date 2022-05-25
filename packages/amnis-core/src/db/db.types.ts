import type { Store } from '@reduxjs/toolkit';
import type { Entity, EntityQuery } from '../entity/entity.types';
import type { Reference } from '../core.types';

export interface Database {
  initialize: (...params: any[]) => void;
  create: (store: Store) => boolean;
  update: (store: Store) => boolean;
  delete: (references: Record<string, Reference>) => boolean;
  select: (query: EntityQuery) => Record<string, Entity[]>;
}
