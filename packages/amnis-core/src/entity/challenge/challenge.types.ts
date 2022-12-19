import type { DateNumeric, UID } from '../../types.js';
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';

/**
 * Entity that contains data to verify credentials.
 */
export interface Challenge extends EntityCreator {
  /**
   * @minLength 16
   * @maxLength 256
   * @description The string random value of the challenge.
   */
  value: string;

  /**
   * @type number
   * @min 0
   * @description Expiration date-time of the challenge.
   */
  expires: DateNumeric;

  /**
   * @type string
   * @minLength 16
   * @maxLength 64
   * @description The subject being challenged.
   */
  $subject?: UID;

  /**
   * @type string
   * @minLength 6
   * @maxLength 32
   * @description An optional one-time passcode value to be generate administratively.
   */
  otp?: string;
}

/**
 * Base object without a generated identifier.
 */
export type ChallengeBase = EntityCreatorBase<Challenge>;

/**
 * Minimal parameters for creation.
 */
export type ChallengeCreator = EntityCreatorParams<Challenge, 'value'>;
