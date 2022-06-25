---
to: "<%= path ? `${path}/${name}/${name}.types.ts` : null %>"
---
import type { Entity } from '../entity';

/**
 * <%= Name %> entity
 */
export interface <%= Name %> extends Entity {
  /**
   * Property
   */
  prop: unknown;
}
