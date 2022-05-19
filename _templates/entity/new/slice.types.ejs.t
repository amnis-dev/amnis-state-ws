---
to: <%= `packages/amnis-state/src/${category}/${name}/${name}.types.ts` %>
---
import type { Entity } from '@amnis/coretypes/entity';

/**
 * Entity type
 */
export interface <%= Name %> extends Entity<'<%= Name %>'> {
  /**
   * Entity type.
   * @default "<%= Name %>"
   */
  type: '<%= Name %>';
}

/**
 * Meta data for a set of the 
 */
export interface <%= Name %>Set {
  /**
   * The entity id this user is focused on.
   */
  focused: string | null;

  /**
   * The entity ids this user has selected.
   */
  selected: string[];
}