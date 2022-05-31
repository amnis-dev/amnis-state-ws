---
to: "<%= path ? `${path}/${name}/${name}.types.ts` : null %>"
---
import type { Entity, Meta } from '@amnis/core/types';

/**
 * <%= Name %> entity
 */
export interface <%= Name %> extends Entity {
  /**
   * Properties for <%= name %>.
   */
  myProperty: string;
}

/**
 * <%= Name %> collection meta data.
 */
export type <%= Name %>Meta = Meta<<%= Name %>>;
