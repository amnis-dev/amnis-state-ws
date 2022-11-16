/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityState } from '@reduxjs/toolkit';
import type { UID, UIDList, DateJSON } from '../types.js';

/**
 * A common entity object.
 * Entity's are serializable (JSON) objects that can be committed to NoSQL Databases.
 */
export interface Entity {
  /**
   * UID for this entity.
   * @default ""
   */
  readonly $id: UID;

  /**
   * Creation date string.
   * @default ""
   */
  readonly created: DateJSON;

  /**
   * Updated date string.
   * @default ""
   */
  updated: DateJSON;

  /**
   * Flag to determine if the entity has been committed to storage.
   * @default false
   */
  committed: boolean;

  /**
   * If this entity is marked to be deleted.
   * @default false
   */
  delete: boolean;

  /**
   * Entity that owns this data.
   */
  $owner: UID;

  /**
   * Possible user id creator of the entity.
   */
  $creator: UID;

  /**
   * Entities that can observe this data.
   * Pseudo-owners of this data, but only as a reader.
   */
  $readers: UIDList;
}

/**
 * Meta information for an entity collection.
 */
export interface Meta<E extends Entity> {
  /**
   * The entity id referencing the active entity.
   */
  active: UID<E> | null;

  /**
    * The id representing a focused entity.
    */
  focused: UID<E> | null;

  /**
   * List of ids considered to be selected.
   */
  selection: UID<E>[];

  /**
   * Record of original entity data since last updated from the api.
   */
  original: Record<UID<E>, E | undefined>;

  /**
   * Property differences between current and original entities.
   */
  differences: Record<UID<E>, (keyof E)[] | undefined>
}

/**
 * Ambiguous entity type.
 */
export interface EntityAmbiguous extends Entity {
  [key: string]: any;
}

/**
 * Omitted types of the core Entity interface.
 */
export type EntityOmit<E extends Entity> = Omit<E, keyof Entity>

/**
 * Type for creation method
 */
export type EntityExtension<E extends Entity> = EntityOmit<E>;

/**
 * Type for an partial method.
 */
export type EntityPartial<E extends Entity> = Partial<EntityExtension<E>>;

/**
 * Type for an entity create object.
 */
export type EntityCreator<E extends Entity> = EntityExtension<E> & { $id: UID<E> };

/**
 * Type for an entity update object.
 */
export type EntityUpdate<E extends Entity> = EntityPartial<E> & { $id: UID<E> };

/**
 * Create an entity creation parameters.
 */
export type EntityExtensionCreate<E extends Entity, K extends keyof E> =
 Pick<E, K> & Omit<EntityPartial<E>, K>;

/**
 * An entity state.
 */
export type MetaState<E extends Entity> = EntityState<E> & Meta<E>;
