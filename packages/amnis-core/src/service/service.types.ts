import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity';
import { DateJSON } from '../types';

/**
 * Service entity
 */
export interface Service extends Entity {
  /**
   * Name of the service.
   */
  name: unknown;

  /**
   * Description of the service.
   */
  description?: string;

  /**
   * Status of the service.
   */
  status: 'offline' | 'running' | 'restarting';

  /**
   * Last checked datetime
   */
  dateChecked: DateJSON;
}

/**
 * Service properties excluding the extended entity properties.
 */
export type ServiceBase = EntityExtension<Service>;

/**
 * Base properties in order to create a log.
 */
export type ServiceBaseCreate = EntityExtensionCreate<Service, 'name'>;
