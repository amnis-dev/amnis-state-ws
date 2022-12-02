import { uid } from '../../uid.js';
import type { Log, LogBase, LogCreator } from './log.types.js';

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
export function logCreator(log: LogCreator): Log {
  return {
    ...logBase,
    ...log,
    $id: uid(logKey),
  };
}
