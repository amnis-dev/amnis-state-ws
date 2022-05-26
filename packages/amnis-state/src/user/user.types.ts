import type { Reference } from '@amnis/core/core.types';
import type { License } from '@amnis/core/license/license.types';
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

  /**
   * Licences this entity has.
   */
  readonly $licenses: Reference<License>[];
}

/**
 * User collection meta data.
 */
export type UserMeta = EntityMeta<User>;
