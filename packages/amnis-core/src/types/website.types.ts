import { Reference, SURL } from './core.types';
import { Entity } from './entity.types';
import { Image } from './image.types';

/**
 * Types of social networks available.
 */
export type WebsiteSocialType =
'facebook' | 'twitter' | 'instagram' | 'youtube'
| 'reddit' | 'discord' | 'twitch' | 'steam' | 'itchio';

/**
 * A social network object.
 */
export interface WebsiteSocial {
  type: WebsiteSocialType;
  link: SURL;
}

/**
 * Contacts for the website.
 */
export interface WebsiteContacts {
  name: string;
  phone: string;
  email: string;
}

export interface Website extends Entity {
  /**
   * Name of the website.
   */
  name: string;

  /**
   * Possible name that is shorter.
   */
  nameShort?: string;

  /**
   * Domain name.
   */
  domain: string;

  /**
   * A title of the website.
   */
  title?: string;

  /**
   * Reference to the image used for the logo.
   */
  $logo?: Reference<Image>;

  /**
   * Link the website's favicon
   */
  $favicon?: Reference<Image>;

  /**
   * Contacts that should be listed on the website.
   */
  contacts: WebsiteContacts[];

  /**
   * List of the social network links.
   */
  socials: WebsiteSocial[];
}
