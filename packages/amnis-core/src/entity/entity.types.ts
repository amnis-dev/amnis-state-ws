import type { EntityState as RTKEntityState } from '@reduxjs/toolkit';
import type { Reference, Entity } from '../core.types';

/**
 * Meta information for a collection of enities.
 */
export interface EntityMeta<E extends Entity> {
  /**
   * The entity id referencing the active entity.
   */
  active: Reference<E> | null;

  /**
    * The id representing a focused entity.
    */
  focused: Reference<E> | null;

  /**
    * List of ids considered to be selected.
    */
  selection: Reference<E>[];
}

/**
 * Omitted types of the core Entity interface.
 */
export type EntityOmit<E> = Omit<E, keyof Entity>

/**
 * Type for Entity Creation
 */
export type EntityCreate<E extends Entity> = EntityOmit<E>;

/**
 * Type for an Entity Updating
 */
export type EntityUpdate<E extends Entity> = Partial<EntityOmit<E>>;

/**
 * An entity state.
 */
export type EntityState<E extends Entity> = RTKEntityState<E> & EntityMeta<E>;

/**
 * ================================================================================
 * Payloads
 * ------------------------------------------------------------
 */

export interface EntityPayload<T = Record<string, unknown>> {
  [slice: string]: T[];
}
export type EntityPayloadCreate = EntityPayload<EntityCreate<Entity>>;

export type EntityPayloadUpdate = EntityPayload<EntityUpdate<Entity>>;

export type EntityPayloadActiveSet<E extends Entity> = Reference<E>;

export type EntityPayloadFocusSet<E extends Entity> = Reference<E>;

export type EntityPayloadSelectionSet<E extends Entity> = Reference<E>[];
