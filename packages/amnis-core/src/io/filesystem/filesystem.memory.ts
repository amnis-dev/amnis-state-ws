import {
  imageCreator,
  entityCreate,
} from '../../entity/index.js';
import { FileSystem } from './filesystem.types.js';

const storage: Record<string, Uint8Array> = {};

export const filesystemMemory: FileSystem = {
  initialize: () => { /** noop */ },

  imageWrite: async (buffer, imageProps = {}) => {
    try {
      /**
       * Create an image entity.
       */
      const imageEntity = entityCreate(imageCreator({
        extension: 'webp',
        mimetype: 'image/webp',
        title: 'Unknown Image',
        height: 0,
        width: 0,
        size: buffer.byteLength,
        ...imageProps,
      }));

      /**
       * Save the file to databaseMemory.
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

export default filesystemMemory;
