import type { UID } from '../types';
import type { Entity } from '../entity';
import type { GrantString } from '../grant';

/**
 * A permit is a list of grants for a specific identifier ID.
 */
export interface Permit extends Entity {
  /**
   * UID to the entity that issued this permit.
   */
  $issuer: UID;

  /**
   * Owner of the permit that can perform the granted actions.
   */
  $holder: UID;

  /**
   * UID to the entity that the owner has been granted actions on.
   */
  $target: UID;

  /**
   * Grants this permit provides.
   */
  grants: GrantString[];
}
