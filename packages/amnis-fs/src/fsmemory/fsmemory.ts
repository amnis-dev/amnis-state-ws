// import { fileTypeFromBuffer } from 'file-type';
import { imageSize } from 'image-size';
import { imageCreate } from '@amnis/core/image/index.js';
import type { FileSystem } from '../types.js';
import { fsConfig } from '../config.js';
import { isWebp } from '../utility.js';

const storage: Record<string, Buffer> = {};

export const fsmemory: FileSystem = {
  initialize: () => { /** noop */ },

  imageWrite: async (buffer, imageProps = {}) => {
    /**
     * Ensure the file type is a webp.
     * Only webp files can be uploaded to the service.
     */
    /** TODO: Import file-type when project is ESM */
    // const fileType = await fileTypeFromBuffer(buffer);

    // if (!fileType || fileType.mime !== 'image/webp') {
    //   return undefined;
    // }

    if (!isWebp(buffer)) {
      return undefined;
    }

    /**
     * Get the dimensions of the image.
     * Images can be no greater than the configured amount.
     */
    const fileDimensions = await imageSize(buffer);

    if (
      !fileDimensions.width
      || !fileDimensions.height
      || fileDimensions.width > fsConfig.FS_MAX_IMAGE_SIZE
      || fileDimensions.height > fsConfig.FS_MAX_IMAGE_SIZE
    ) {
      return undefined;
    }

    /**
     * Create an image entity.
     */
    const imageEntity = imageCreate({
      extension: 'webp',
      mimetype: 'image/webp',
      title: 'Unknown Image',
      height: fileDimensions.height,
      width: fileDimensions.width,
      size: Buffer.byteLength(buffer),
      ...imageProps,
    });

    /**
     * Save the file to memory.
     */
    storage[imageEntity.$id] = buffer;

    /**
     * Return the image entity object.
     */
    return imageEntity;
  },

  imageRead: async (imageId) => storage[imageId],
};

export default fsmemory;
