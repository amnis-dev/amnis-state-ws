import type { Media } from '../media';

export interface Video extends Media {
  /**
   * Video format type.
   */
  format: 'webm' | 'mp4' | 'mpeg' | 'mov' | 'H264';

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
