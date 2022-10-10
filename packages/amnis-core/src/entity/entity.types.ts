/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityState } from '@reduxjs/toolkit';
import type { Identifier, IdentifierList, DateJSON } from '../types';

/**
 * A common entity object.
 * Entity's are serializable (JSON) objects that can be committed to NoSQL Databases.
 */
export interface Entity {
  /**
   * Identifier for this entity.
   * @default ""
   */
  readonly $id: Identifier;

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
  $owner: Identifier;

  /**
   * Possible user id creator of the entity.
   */
  $creator: Identifier;

  /**
   * Entities that can observe this data.
   * Pseudo-owners of this data, but only as a reader.
   */
  $readers: IdentifierList;
}

/**
 * Meta information for an entity collection.
 */
export interface Meta<E extends Entity> {
  /**
   * The entity id referencing the active entity.
   */
  active: Identifier<E> | null;

  /**
    * The id representing a focused entity.
    */
  focused: Identifier<E> | null;

  /**
    * List of ids considered to be selected.
    */
  selection: Identifier<E>[];
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
export type EntityCreate<E extends Entity> = EntityExtension<E> & E['$id'];

/**
 * Type for an entity update object.
 */
export type EntityUpdate<E extends Entity> = EntityPartial<E> & E['$id'];

/**
 * Create an entity creation parameters.
 */
export type EntityExtensionCreate<E extends Entity, K extends keyof E> =
 Pick<E, K> & Omit<EntityPartial<E>, K>;

/**
 * An entity state.
 */
export type MetaState<E extends Entity> = EntityState<E> & Meta<E>;
