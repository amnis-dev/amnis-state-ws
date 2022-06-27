import { entityCreate } from '../entity/entity';
import type { Log, LogBase, LogBaseCreate } from './log.types';

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
export function logCreate(log: LogBaseCreate): [Log, Log[]] {
  const logs: Log[] = [];
  return [entityCreate<Log>(logKey, {
    ...logBase,
    ...log,
  }), logs];
}
