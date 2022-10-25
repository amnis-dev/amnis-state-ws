import { imageCreate, FileSystem } from '@amnis/core';
import { fsConfig } from '../config.js';
import { isWebp, WEBP } from '../utility.js';

const storage: Record<string, Buffer> = {};

export const fsmemory: FileSystem = {
  initialize: () => { /** noop */ },

  imageWrite: async (buffer, imageProps = {}) => {
    try {
    /**
     * Ensure the file type is a webp.
     * Only webp files can be uploaded to the service.
     */
      if (!(WEBP.validate(buffer) && isWebp(buffer))) {
        return undefined;
      }

      /**
     * Get the dimensions of the image.
     * Images can be no greater than the configured amount.
     */
      const fileDimensions = WEBP.calculate(buffer);

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
    } catch (error) {
      return undefined;
    }
  },

  imageRead: async (imageId) => storage[imageId],
};

export default fsmemory;
