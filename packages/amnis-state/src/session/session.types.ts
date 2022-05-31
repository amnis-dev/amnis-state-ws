import type { Entity, Meta } from '@amnis/core/types';

/**
 * Session entity
 */
export interface Session extends Entity {
  /**
   * Display name for the session.
   */
  myProperty: string;
}

/**
 * Session collection meta data.
 */
export type SessionMeta = Meta<Session>;
