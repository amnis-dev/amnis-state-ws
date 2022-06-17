import type {
  Entity, Meta, Reference, SURL,
} from '@amnis/core/types';
import { User } from '../user';

/**
 * Profile entity
 */
export interface Profile extends Entity {
  /**
   * User this profile is associated with.
   */
  $user: Reference<User>;

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
   * @title name-family
   */
  nameFamily?: string;

  /**
   * Date of birth.
   */
  birthDate?: string;

  /**
   * Avatar image
   */
  avatar?: SURL;
}

/**
 * Profile collection meta data.
 */
export type ProfileMeta = Meta<Profile>;
