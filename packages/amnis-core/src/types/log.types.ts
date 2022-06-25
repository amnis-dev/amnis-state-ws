import type { Reference } from './core.types';
import type { Entity } from './entity.types';
import type { User } from './user.types';

/**
 * Log levels.
 */
export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug';

/**
 * An entity object that contains log information.
 */
export interface Log extends Entity {
  /**
   * Level of the log.
   */
  level: LogLevel;

  /**
   * Title of the log.
   */
  title: string;

  /**
   * Description of the log.
   */
  description: string;

  /**
   * System this log is from.
   */
  system: string;

  /**
   * Reference to a user that invoked the log.
   */
  $invoker?: Reference<User>;
}
