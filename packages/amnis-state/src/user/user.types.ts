import type {
  Entity,
  EntityReference,
  EntityCreate,
  EntityUpdate,
} from '@amnis/core/entity.types';

/**
 * User Entity
 */
export interface User extends Entity {
  /**
   * Display name for the user.
   */
  displayName: string;
}

/**
 * Meta interface for User entities.
 */
export interface UserSet {
  /**
   * The id that is currently active on the single entity state.
   */
  active: EntityReference<User>;

  /**
   * The entity id this user is focused on.
   */
  focused: EntityReference<User> | null;

  /**
   * The entity ids this user has selected.
   */
  selected: EntityReference<User>[];
}

/**
 * ================================================================================
 * Payload Types
 * ----------------------------------------
 */

/**
 * Creates a new User.
 */
export type UserPayloadCreate = EntityCreate<User>;

/**
 * Updates a new User.
 */
export type UserPayloadUpdate = EntityUpdate<User>;

/**
 * Sets focus on a specific user in the set.
 */
export type UserSetPayloadSetFocused = EntityReference<User>;

/**
 * Sets selected user entities in the set.
 */
export type UserSetPayloadSetSelected = EntityReference<User>[];
