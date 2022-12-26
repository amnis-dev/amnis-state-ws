import type { DateNumeric, UID } from '../../types.js';
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';

/**
 * Entity that contains data to verify credentials.
 */
export interface Challenge extends EntityCreator {
  /**
   * The string random value of the challenge.
   *
   * @minLength 16
   * @maxLength 256
   */
  value: string;

  /**
   * Expiration date-time of the challenge.
   */
  expires: DateNumeric;

  /**
   * The subject being challenged.
   */
  $subject?: UID;

  /**
   * An optional one-time passcode value to be generate administratively.
   *
   * @minLength 6
   * @maxLength 32
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
