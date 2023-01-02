import type { UID } from '@amnis/core';

/**
 * Challenge collection meta.
 */
export interface ChallengeMeta {
  /**
   * Challenges that require OTP values.
   */
  otps: UID[];
}
