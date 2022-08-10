import type { Reference, SURL } from '../types.js';
import type { Entity } from '../entity/entity.types.js';
import type { Image } from '../image/image.types.js';
import type { Contact } from '../contact/index.js';

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
   * Possible name that is shorter.
   */
  nameShort?: string;

  /**
   * Primary to the website.
   */
  url: string;

  /**
   * A title to access the website.
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
