import { entityCreate } from '../entity/entity';
import type { EntityExtension, EntityExtensionCreate } from '../entity/entity.types';
import type { Log } from './log.types';

export const logKey = 'log';

export const logBase: EntityExtension<Log> = {
  level: 'debug',
  title: 'Untitled Log',
  description: 'This log has no description.',
  system: 'System',
};

/**
 * Creates a log entry.
 */
export function logCreate(log: EntityExtensionCreate<Log, 'title' | 'description' | 'level'>): Log {
  return entityCreate<Log>(logKey, {
    ...logBase,
    ...log,
  });
}
