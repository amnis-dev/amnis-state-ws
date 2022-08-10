import type { Reference } from '../types.js';
import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity/entity.types.js';
import type { User } from '../user/user.types.js';

/**
 * Log levels.
 */
export type LogLevel = 'fatal' | 'error' | 'success' | 'warn' | 'info' | 'debug';

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

/**
 * Base properties excluding the extended entities.
 */
export type LogBase = EntityExtension<Log>;

/**
 * Base properties in order to create a log.
 */
export type LogBaseCreate = EntityExtensionCreate<Log, 'title' | 'description' | 'level'>;
