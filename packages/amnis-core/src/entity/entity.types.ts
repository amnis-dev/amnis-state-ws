import type { EntityState as RTKEntityState } from '@reduxjs/toolkit';
import type { Reference, DateJSON } from '../core.types';

/**
 * A common entity object.
 * Entity's are serializable (JSON) objects that can be committed to NoSQL Databases.
 */
export interface Entity {
  /**
   * Identifier for this entity.
   * @default ""
   */
  readonly id: string;

  /**
   * Creation date string.
   * @default ""
   */
  readonly dateCreated: DateJSON;

  /**
   * Updated date string.
   * @default ""
   */
  dateUpdated: DateJSON;

  /**
   * Possible creator of the entity.
   */
  readonly entityCreator: string | null;

  /**
   * Possible updater of the entity.
   * @default null
   */
  entityUpdater: string | null;

  /**
   * Flag to determine if the entity has been committed to storage.
   * @default false
   */
  committed: boolean;

  /**
   * Anything that begins with a '$' must be a document reference.
   */
  [key: `$${string}`]: Reference | Reference[];

  /**
   * Properties can only be serializable, normalized, values.
   */
  [key: string]: boolean | number | string | null | undefined | string[];
}

/**
 * Key to an entity meta object.
 */
export type EntityMetaKey<N extends string = string> = `entity:${N}`;

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
 * An interface for filtering entities.
 */
export type EntityFilter<E extends Entity = Entity> = {
  [Key in keyof E]?: {
    defined?: boolean;
    lessThan?: number;
    greaterThan?: number;
    equals?: string | number | boolean | null;
    includes?: string | number;
  }
};

/**
 * Sets types on an objects to undefined if they're not a subtype of Entity.
 */
type EntityQueryNestInclude<E> = {
  [Key in keyof E]?:
  E[Key] extends Reference<infer R> ? EntityQueryNestInclude<R> : undefined
};

/**
 * Removes all properties from an object that are not subtypes of Entity.
 */
export type EntityQueryNest<E extends Entity> = Pick<
EntityQueryNestInclude<E>,
{
  [K in keyof EntityQueryNestInclude<E>]:
  EntityQueryNestInclude<E>[K] extends undefined ? never : K
}[
  keyof EntityQueryNestInclude<E>
]
>;

/**
 * An entity state.
 */
export type EntityState<E extends Entity> = RTKEntityState<E> & EntityMeta<E>;

/**
 * ================================================================================
 * Payloads
 * ------------------------------------------------------------
 */
export type EntityPayloadCreate<E extends Entity> = EntityCreate<E>;

export type EntityPayloadActiveSet<E extends Entity> = Reference<E>;

export type EntityPayloadFocusSet<E extends Entity> = Reference<E>;

export type EntityPayloadSelectionSet<E extends Entity> = Reference<E>[];
