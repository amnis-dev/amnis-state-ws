import type { Identifier, SURL } from '../types';
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
   * Identifier to the image used for the logo.
   */
  $logo?: Identifier<Image>;

  /**
   * Link the website's favicon
   */
  $favicon?: Identifier<Image>;

  /**
   * Contacts that should be listed on the website.
   */
  $contacts: Identifier<Contact>[];

  /**
   * List of the social network links.
   */
  socials: SURL[];
}
