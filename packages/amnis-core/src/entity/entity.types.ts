/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityState } from '@reduxjs/toolkit';
import type { UID, UIDList, DateJSON } from '../types.js';

/**
 * Subset interface for an entity.
 */
export interface EntityCreator {
  /**
   * All objects that can be composed into an entity must have an
   * identifier.
   */
  $id: UID;
}

/**
 * An abstract interface that can only be formed from an entity creator object.
 */
export type Entity<C extends EntityCreator = EntityCreator> = C & {
  /**
   * UID for this entity.
   * @default ""
   */
  readonly $id: UID<C>;

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
};

/**
 * Meta information for an entity collection.
 */
export interface Meta<C extends EntityCreator> {
  /**
   * The entity id referencing the active entity.
   */
  active: UID<C> | null;

  /**
    * The id representing a focused entity.
    */
  focused: UID<C> | null;

  /**
   * List of ids considered to be selected.
   */
  selection: UID<C>[];

  /**
   * Record of original entity data since last updated from the api.
   */
  original: Record<UID<C>, Entity<C> | undefined>;

  /**
   * Property differences between current and original entities.
   */
  differences: Record<UID<C>, (keyof Entity<C>)[] | undefined>
}

/**
 * Base object for default settings on a entity creator.
 */
export type EntityCreatorBase<C extends EntityCreator> = Omit<C, '$id'>;

/**
 * Create an entity creation parameters.
 */
export type EntityCreatorParams<
  C extends EntityCreator,
  K extends keyof C
> = Pick<C, K> & Omit<Partial<C>, K>;

/**
 * Subset interface for updating a creator entity
 */
export type EntityUpdater<C extends EntityCreator> = Partial<Omit<C, '$id'>> & { $id: UID<C>; };

/**
 * An entity state.
 */
export type MetaState<C extends EntityCreator> = EntityState<Entity<C>> & Meta<C>;
