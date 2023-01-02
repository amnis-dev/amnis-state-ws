import type { DateNumeric, UID } from '../../types.js';

/**
 * Entity that contains data to verify credentials.
 */
export interface Challenge {
  /**
   * Challenge identifier
   */
  $id: UID;

  /**
   * The string random value of the challenge.
   *
   * @minLength 16
   * @maxLength 256
   */
  val: string;

  /**
   * Expiration date-time of the challenge.
   *
   * @min 0
   */
  exp: DateNumeric;

  /**
   * A reference value that can indicate what endpoint this challenge is intended for.
   *
   * @maxLength 64
   */
  ref?: string;

  /**
   * The subject being challenged.
   */
  $sub?: UID;

  /**
   * An optional one-time passcode value to be generate administratively.
   *
   * @maxLength 32
   */
  otp?: string;

  /**
   * Specifies the exact length the OTP must be.
   *
   * @min 1
   * @max 32
   */
  otpl?: number;
}
