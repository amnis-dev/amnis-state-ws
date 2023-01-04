import type { DateNumeric, UID } from '../../types.js';

/**
 * A short-lived object that contains a one-time password.
 */
export interface Otp {
  /**
   * OTP identifier
   */
  $id: UID;

  /**
   * Subject this OTP is intended for.
   */
  $sub: UID;

  /**
   * The string random value of the OTP.
   *
   * @minLength 4
   * @maxLength 24
   */
  val?: string;

  /**
   * The length the OTP expects.
   *
   * @min 4
   * @max 24
   */
  len: number;

  /**
   * Expiration date-time of the Otp.
   */
  exp: DateNumeric;
}
