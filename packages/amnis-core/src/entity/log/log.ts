import type { EntityCreator } from '../entity.types.js';
import { uid } from '../../uid.js';
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
export function logCreator(log: LogBaseCreate): EntityCreator<Log> {
  return {
    ...logBase,
    ...log,
    $id: uid(logKey),
  };
}
