---
to: "<%= path ? `${path}/${name}/${name}.types.ts` : null %>"
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
  myProperty?: string;
}

/**
 * <%= Name %> collection meta data.
 */
export type <%= Name %>Meta = EntityMeta<<%= Name %>>;

/**
 * <%= Name %> state.
 */
export type <%= Name %>State = EntityState<<%= Name %>> & <%= Name %>Meta;

/**
 * <%= Name %> root state.
 */
export interface <%= Name %>RootState {
  ['@amnis/<%= name %>']: <%= Name %>State;
}
