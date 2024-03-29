import type { DateJSON, UID, SURL } from '../../types.js';
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';
import type { User } from '../user/user.types.js';
import type { Contact } from '../contact/index.js';

/**
 * Profile entity
 */
export interface Profile extends EntityCreator {
  /**
   * User this profile is associated with.
   */
  $user: UID<User>;

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
  birthDate?: DateJSON;

  /**
   * Title for work or otherwise.
   */
  title?: string;

  /**
   * Profile Contact.
   */
  $contact?: UID<Contact>;

  /**
   * Organization profile is a part of.
   */
  organization?: string;

  /**
   * Avatar string url to an image.
   */
  avatar?: SURL;
}

/**
 * Profile properties excluding the extended entity properties.
 */
export type ProfileBase = EntityCreatorBase<Profile>;

/**
  * Base properties.
  */
export type ProfileCreator = EntityCreatorParams<Profile, 'nameDisplay' | '$user'>;
