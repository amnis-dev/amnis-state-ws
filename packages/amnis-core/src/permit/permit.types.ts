import type { Reference } from '../types';
import type { Entity } from '../entity';
import type { GrantString } from '../grant';

/**
 * A permit is a list of grants for a specific reference ID.
 */
export interface Permit extends Entity {
  /**
   * Reference to the entity that issued this permit.
   */
  $issuer: Reference;

  /**
   * Owner of the permit that can perform the granted actions.
   */
  $holder: Reference;

  /**
   * Reference to the entity that the owner has been granted actions on.
   */
  $target: Reference;

  /**
   * Grants this permit provides.
   */
  grants: GrantString[];
}
