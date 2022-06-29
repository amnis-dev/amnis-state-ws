import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity';
import { SURL } from '../types';

/**
 * Contact entity
 */
export interface Contact extends Entity {
  /**
   * Name (or title) of the contact
   * @title Name
   */
  name: string;

  /**
   * phone number
   * @title Phone Nubmer
   */
  phone?: string;

  /**
   * Contact email.
   * @title E-Mail Address
   */
  email?: string;

  /**
   * Contact's social urls.
   */
  socials: SURL[];
}

/**
 * Contact properties excluding the extended entity properties.
 */
export type ContactBase = EntityExtension<Contact>;

/**
 * Base properties in order to create a log.
 */
export type ContactBaseCreate = EntityExtensionCreate<Contact, 'name'>;
