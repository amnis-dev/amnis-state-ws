import type { EntityState } from '@reduxjs/toolkit';
import type {
  Entity,
  EntityMeta,
} from '@amnis/core/entity';

/**
 * User entity
 */
export interface User extends Entity {
  /**
   * Display name for the user.
   */
  displayName: string;
}

/**
 * User collection meta data.
 */
export type UserMeta = EntityMeta<User>;

/**
 * User state.
 */
export type UserState = EntityState<User> & UserMeta;

/**
 * User root state.
 */
export interface UserRootState {
  user: UserState;
}
