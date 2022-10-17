import { EntityExtension, EntityExtensionCreate } from '../entity/index.js';
import type { File } from '../file/file.types.js';

export interface Video extends File {
  /**
   * Video format type.
   */
  extension: 'webm' | 'mp4' | 'mpeg' | 'mov';

  /**
   * Original width in pixels.
   */
  width: number;

  /**
   * Original height in pixels.
   */
  height: number;

  /**
   * Aspect ratio calculation (width / height).
   */
  aspect: number;

  /**
   * Duration length of the video in seconds.
   */
  duration: number;
}

/**
 * Video properties excluding the extended entity properties.
 */
export type VideoBase = EntityExtension<Video>;

/**
    * Base properties in order to create an image.
    */
export type VideoBaseCreate = EntityExtensionCreate<Video, 'title' | 'mimetype' | 'size' | 'extension' | 'width' | 'height' | 'duration'>;
