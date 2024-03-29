---
to: "<%= path ? `${path}/${name}/${name}.types.ts` : null %>"
---
import type { Entity, EntityCreatorBase, EntityExtensionCreate } from '../entity/index.js';

/**
 * <%= Name %> entity
 */
export interface <%= Name %> extends Entity {
  /**
   * Property
   */
  prop: unknown;
}

/**
 * <%= Name %> properties excluding the extended entity properties.
 */
export type <%= Name %>Base = EntityCreatorBase<<%= Name %>>;

/**
 * Base properties in order to create a log.
 */
export type <%= Name %>BaseCreate = EntityExtensionCreate<<%= Name %>, 'prop'>;
