import { Media } from './media.types';

export interface Image extends Media {
  /**
   * image format type.
   */
  format: 'webp' | 'jpeg' | 'png' | 'bmp' | 'tiff';

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
