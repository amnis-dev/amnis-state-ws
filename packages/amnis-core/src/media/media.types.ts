import type { Reference, SURL } from '../types.js';
import type { Entity } from '../entity/index.js';
import type { Profile } from '../profile/index.js';

/**
 * An abstract media type intended to be extended my more specific types: Image, Video, and Audio.
 */
export interface Media extends Entity {
  /**
   * Title of the image.
   */
  title: string;

  /**
   * Description for the image.
   */
  description?: string;

  /**
   * String name of the media author.
   */
  author?: string;

  /**
   * Profile reference to the author.
   */
  $author?: Reference<Profile>;

  /**
   * The source url for the media.
   */
  source: SURL;

  /**
   * Size of the media on disk in bytes.
   */
  size: number;
}
