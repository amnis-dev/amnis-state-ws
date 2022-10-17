import { entityCreate } from '../entity/entity.js';
import type { Log, LogBase, LogBaseCreate } from './log.types.js';

export const logKey = 'log';

export const logBase: LogBase = {
  level: 'debug',
  title: 'Untitled Log',
  description: 'This log has no description.',
  system: 'System',
};

/**
 * Creates a log entry.
 */
export function logCreate(log: LogBaseCreate): Log {
  return entityCreate<Log>(logKey, {
    ...logBase,
    ...log,
  });
}
