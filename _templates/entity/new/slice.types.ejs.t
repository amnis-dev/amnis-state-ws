---
to: <%= `packages/amnis-state/src/${name}/${name}.types.ts` %>
---
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Entity,
  EntityReference,
  EntityCreate,
} from '@amnis/core/entity.types';

/**
 * <%= Name %> Entity
 */
export interface <%= Name %> extends Entity {
  /**
   * Entity properties.
   */
  myProperty?: string;
}

/**
 * Meta interface for <%= Name %> entities.
 */
export interface <%= Name %>Set {
  /**
   * The entity id this <%= name %> is focused on.
   */
  focused: EntityReference<<%= Name %>> | null;

  /**
   * The entity ids this <%= name %> has selected.
   */
  selected: EntityReference<<%= Name %>>[];
}

/**
 * ================================================================================
 * Action Types
 * ----------------------------------------
 */

/**
 * Creates a new <%= Name %>.
 */
export type <%= Name %>ActionCreate = PayloadAction<EntityCreate<<%= Name %>>>;

/**
 * Sets focus on a specific <%= name %> in the set.
 */
export type <%= Name %>SetActionSetFocused = PayloadAction<EntityReference<<%= Name %>>>;

/**
 * Sets selected <%= name %> entities in the set.
 */
export type <%= Name %>SetActionSetSelected = PayloadAction<EntityReference<<%= Name %>>[]>;
