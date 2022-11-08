import { Entity, EntityUpdate } from '../entity/entity.types.js';
import { UID } from '../types.js';
import type { Chrono } from './chrono.types.js';

export const chronoKey = 'chrono';

export const chronoBase: Chrono = {
  past: [],
  future: [],
  records: {} as Record<UID, EntityUpdate<Entity>[]>,
};
