import type { SURL } from './core.types';
import type { Entity } from './entity.types';

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
   * Author of the media
   */
  author?: string;

  /**
   * The source url for the media.
   */
  source: SURL;

  /**
   * Size of the media on disk in bytes.
   */
  size: number;
}
