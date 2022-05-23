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
