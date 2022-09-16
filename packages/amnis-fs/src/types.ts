/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Image } from '@amnis/core/image';

export type FileSystemSaveImageMethod = (
  buffer: Buffer,
) => Promise<Image>;

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
  saveImage: FileSystemSaveImageMethod;
}
