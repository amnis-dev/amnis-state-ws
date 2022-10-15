import type { UID, SURL, UIDTree } from '../types.js';
import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity/entity.types.js';
import type { Image } from '../image/image.types.js';
import type { Contact } from '../contact/index.js';
import type { Route } from '../route/index.js';

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
   * Primary navigational routes.
   */
  $navigation: UIDTree<Route>;

  /**
   * Default title for the website. This is for meta data and the text seen on the browser tab.
   */
  title?: string;

  /**
   * UID to the image used for the logo.
   */
  $logo?: UID<Image>;

  /**
   * Link the website's favicon
   */
  $favicon?: UID<Image>;

  /**
   * Contacts that should be listed on the website.
   */
  $contacts: UID<Contact>[];

  /**
   * List of the social network links.
   */
  socials: SURL[];
}

/**
 * Website properties excluding the extended entity properties.
 */
export type WebsiteBase = EntityExtension<Website>;

/**
 * Base properties in order to create a log.
 */
export type WebsiteBaseCreate = EntityExtensionCreate<Website, 'name' | 'url'>;
