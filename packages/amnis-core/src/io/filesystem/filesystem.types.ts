/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UID } from '../../types.js';
import type { Image } from '../../entity/index.js';

/**
 * Method for saving data.
 */
export type FileSystemImageWriteMethod = (
  buffer: Uint8Array,
  imageProps: Partial<Image>
) => Promise<Image | undefined>;

/**
 * Method for saving data.
 */
export type FileSystemImageReadMethod = (
  imageId: UID<Image>
) => Promise<Uint8Array | undefined>;

/**
 * Core interface for database methods.
 */
export interface FileSystem {
  /**
   * Method to implement file system initialization.
   */
  initialize: (...params: any[]) => void;

  /**
   * Method for saving/storing files onto the filesystem.
   * If successful, it will return the storaged file information.
   */
  imageWrite: FileSystemImageWriteMethod;

  /**
   * Method for reading images from
   */
  imageRead: FileSystemImageReadMethod;
}
