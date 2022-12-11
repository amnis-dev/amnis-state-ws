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
   * @min 0
   * @description Expiration date-time of the challenge.
   */
  expires: DateNumeric;

  /**
   * @minLength 16
   * @maxLength 64
   * @description The subject being challenged.
   */
  $subject?: UID;

  /**
   * Username that this challenge is indended for.
   * Challenge should only work with the indended username in context.
   */
  username?: string;

  /**
   * @minLength 16
   * @maxLength 256
   * An optional private value to be generate administratively.
   */
  valuePrivate?: string;
}

/**
 * Base object without a generated identifier.
 */
export type ChallengeBase = EntityCreatorBase<Challenge>;

/**
 * Minimal parameters for creation.
 */
export type ChallengeCreator = EntityCreatorParams<Challenge, 'value'>;
