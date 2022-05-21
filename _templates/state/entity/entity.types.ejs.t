---
to: <%= `${cwd}/${name}/${name}.types.ts` %>
---
import type { EntityState } from '@reduxjs/toolkit';
import type {
  Entity,
  EntityMeta,
} from '@amnis/core/entity';

/**
 * <%= Name %> entity
 */
export interface <%= Name %> extends Entity {
  /**
   * Display name for the <%= name %>.
   */
  displayName: string;
}

/**
 * <%= Name %> collection meta data.
 */
export type UserMeta = EntityMeta<<%= Name %>>;

/**
 * <%= Name %> state.
 */
export type UserState = EntityState<<%= Name %>> & UserMeta;

/**
 * <%= Name %> root state.
 */
export interface UserRootState {
  ['@amnis/<%= name %>']: UserState;
}
