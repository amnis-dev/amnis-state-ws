import type { UID } from '../types';
import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity';
import type { Profile } from '../profile';

/**
 * Image Mime Types.
 */
type FileMimetypeImage = 'image/jpeg' | 'image/gif' | 'image/png' | 'image/bmp' | 'image/svg+xml' | 'image/webp' | 'image/tiff';

/**
 * Video Mime Types.
 */
 type FileMimetypeVideo = 'video/mp4' | 'video/mpeg' | 'video/webm';

/**
 * Audio Mime Types.
 */
type FileMimetypeAudio = 'audio/mpeg' | 'audio/ogg' | 'audio/wav' | 'audio/webm';

/**
 * Application Mime Types.
 */
 type FileMimetypeApplication = 'application/pdf';

/**
 * File text.
 */
type FileMimetypeText = 'text/plain';

/**
 * Allowed mimetypes.
 */
type FileMimetype =
  FileMimetypeImage |
  FileMimetypeVideo |
  FileMimetypeAudio |
  FileMimetypeApplication |
  FileMimetypeText;

/**
 * An abstract file type intended to be extended my more specific types: Image, Video, and Audio.
 */
export interface File extends Entity {
  /**
   * Title of the image.
   */
  title: string;

  /**
   * The slug for referencing the image.
   */
  slug: string;

  /**
   * Mime type of the file
   */
  mimetype: FileMimetype;

  /**
   * Size of the media on disk in bytes.
   */
  size: number;

  /**
   * Description for the image.
   */
  description?: string;

  /**
   * String name of the media author.
   */
  author?: string;

  /**
   * Profile identifier to the author.
   */
  $author?: UID<Profile>;
}

/**
 * File properties excluding the extended entity properties.
 */
export type FileBase = EntityExtension<File>;

/**
  * Base properties in order to create a file.
  */
export type FileBaseCreate<F extends File> = EntityExtensionCreate<F, 'title' | 'mimetype' | 'size'>;
