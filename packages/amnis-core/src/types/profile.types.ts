import type { Reference, SURL } from './core.types';
import type { Entity } from './entity.types';
import type { CoreUser } from './user.types';

/**
 * Profile entity
 */
export interface CoreProfile extends Entity {
  /**
   * User this profile is associated with.
   */
  $user: Reference<CoreUser>;

  /**
   * Display name for the profile.
   */
  nameDisplay: string;

  /**
   * Given/First name
   */
  nameGiven?: string;

  /**
   * Family/Last name
   */
  nameFamily?: string;

  /**
   * Date of birth.
   */
  birthDate?: string;

  /**
   * Title for work or otherwise.
   */
  title?: string;

  /**
   * Profile's email.
   */
  email?: string;

  /**
   * Profiles phone number.
   */
  phone?: string;

  /**
   * Organization profile is a part of.
   */
  organiation?: string;

  /**
   * Avatar string url to an image.
   */
  avatar?: SURL;
}
