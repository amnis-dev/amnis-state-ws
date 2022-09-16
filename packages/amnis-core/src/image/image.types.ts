import type { EntityExtension, EntityExtensionCreate } from '../entity';
import type { File } from '../file';

export interface Image extends File {
  /**
   * image extention type.
   */
  extension: 'webp' | 'jpeg' | 'png' | 'bmp' | 'tiff';

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
}

/**
 * Image properties excluding the extended entity properties.
 */
export type ImageBase = EntityExtension<Image>;

/**
   * Base properties in order to create an image.
   */
export type ImageBaseCreate = EntityExtensionCreate<Image, 'title' | 'mimetype' | 'size' | 'extension' | 'width' | 'height'>;
