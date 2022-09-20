/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Image } from '@amnis/core/image';
import { Reference } from '@amnis/core/types';

/**
 * Method for saving data.
 */
export type FileSystemImageWriteMethod = (
  buffer: Buffer,
  imageProps: Partial<Image>
) => Promise<Image | undefined>;

/**
 * Method for saving data.
 */
export type FileSystemImageReadMethod = (
  imageId: Reference<Image>
) => Promise<Buffer | undefined>;

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
