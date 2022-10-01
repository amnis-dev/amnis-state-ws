import type { Reference, SURL } from '../types';
import type { Entity } from '../entity/entity.types';
import type { Image } from '../image/image.types';
import type { Contact } from '../contact';

/**
 * Types of social networks available.
 */
export type WebsiteSocialType =
'facebook' | 'twitter' | 'instagram' | 'youtube'
| 'reddit' | 'discord' | 'twitch' | 'steam' | 'itchio';

export interface Website extends Entity {
  /**
   * Name of the website.
   */
  name: string;

  /**
   * Sorter name of the website. Important for smaller displays.
   */
  nameShort?: string;

  /**
   * Primary URL to the website.
   */
  url: string;

  /**
   * Default title for the website. This is for meta data and the text seen on the browser tab.
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
  $contacts: Reference<Contact>[];

  /**
   * List of the social network links.
   */
  socials: SURL[];
}
