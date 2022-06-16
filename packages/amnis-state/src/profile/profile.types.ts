import type { Entity, Meta } from '@amnis/core/types';

/**
 * Profile entity
 */
export interface Profile extends Entity {
  /**
   * Properties for profile.
   */
  myProperty: string;
}

/**
 * Profile collection meta data.
 */
export type ProfileMeta = Meta<Profile>;
