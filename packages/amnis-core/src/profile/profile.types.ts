import type { DateJSON, Reference, SURL } from '../types.js';
import type { Entity } from '../entity/entity.types.js';
import type { User } from '../user/user.types.js';
import type { Contact } from '../contact/index.js';

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
  $contact?: Reference<Contact>;

  /**
   * Organization profile is a part of.
   */
  organiation?: string;

  /**
   * Avatar string url to an image.
   */
  avatar?: SURL;
}
