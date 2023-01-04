import type { DateNumeric, UID } from '../../types.js';

/**
 * An object containing one-time data to prevent replay attacks.
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
}
