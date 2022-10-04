import type { Identifier } from '../types';
import type { Entity } from '../entity';
import type { GrantString } from '../grant';

/**
 * A permit is a list of grants for a specific identifier ID.
 */
export interface Permit extends Entity {
  /**
   * Identifier to the entity that issued this permit.
   */
  $issuer: Identifier;

  /**
   * Owner of the permit that can perform the granted actions.
   */
  $holder: Identifier;

  /**
   * Identifier to the entity that the owner has been granted actions on.
   */
  $target: Identifier;

  /**
   * Grants this permit provides.
   */
  grants: GrantString[];
}
