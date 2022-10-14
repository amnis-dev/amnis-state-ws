import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity';
import type { UID } from '../types';

/**
 * Data for routing to a resouce.
 */
export interface Route extends Entity {
  /**
   * Text to present when linking this route.
   */
  label: string;

  /**
   * Pathing string for this route.
   */
  path: string;

  /**
   * Entity this route points to.
   */
  $entity?: UID;

  /**
   * An icon associated with the route.
   */
  icon?: string;
}

/**
 * Route properties excluding the extended entity properties.
 */
export type RouteBase = EntityExtension<Route>;

/**
 * Base properties in order to create a log.
 */
export type RouteBaseCreate = EntityExtensionCreate<Route, 'label' | 'path'>;
