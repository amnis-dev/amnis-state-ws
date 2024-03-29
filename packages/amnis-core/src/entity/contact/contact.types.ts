import type {
  EntityCreator, EntityCreatorBase, EntityCreatorParams,
} from '../entity.types.js';
import { SURL } from '../../types.js';

/**
 * Contact entity
 */
export interface Contact extends EntityCreator {
  /**
   * Name (or title) of the contact
   * @title Name
   */
  name: string;

  /**
   * Details about the contact.
   */
  description?: string;

  /**
   * Phone numbers. First item in the array is the primary phone number.
   * @title Phone Numbers
   */
  phones: string[];

  /**
   * Contact emails. First item in the array is the primary email.
   * @title E-Mail Addresses
   */
  emails: string[];

  /**
   * Contact's social urls.
   */
  socials: SURL[];
}

/**
 * Contact properties excluding the extended entity properties.
 */
export type ContactBase = EntityCreatorBase<Contact>;

/**
 * Base properties in order to create a log.
 */
export type ContactCreator = EntityCreatorParams<Contact, 'name'>;
