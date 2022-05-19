import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Entity,
  EntityReference,
  EntityCreate,
} from '@amnis/core/entity.types';

/**
 * User Entity
 */
export interface User extends Entity {
  /**
   * Entity properties.
   */
  myProperty?: string;
}

/**
 * Meta interface for User entities.
 */
export interface UserSet {
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
 * Action Types
 * ----------------------------------------
 */

/**
 * Creates a new User.
 */
export type UserActionCreate = PayloadAction<EntityCreate<User>>;

/**
 * Sets focus on a specific user in the set.
 */
export type UserSetActionSetFocused = PayloadAction<EntityReference<User>>;

/**
 * Sets selected user entities in the set.
 */
export type UserSetActionSetSelected = PayloadAction<EntityReference<User>[]>;
