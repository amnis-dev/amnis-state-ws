import type { UID } from '@amnis/core';

/**
 * Otp collection meta.
 */
export interface OtpMeta {
  /**
   * Latest OTP object generated.
   */
  latest: UID | null;
}
