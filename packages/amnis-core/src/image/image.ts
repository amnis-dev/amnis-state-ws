import { surl } from '../core.js';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity/index.js';
import type { LogBaseCreate } from '../log/index.js';
import type { Image } from './image.types.js';
import { coreConfig } from '../config.js';

export const imageKey = 'image';

export const imageBase: EntityExtension<Image> = {
  format: 'webp',
  width: 0,
  height: 0,
  aspect: 0,
  title: '',
  source: surl(''),
  size: 0,
};

/**
 * Image check method.
 */
export function imageCheck(image: Image): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  if (image.width > coreConfig.imageMaxWidth) {
    logs.push({
      level: 'error',
      title: 'Large Image Size',
      description: `Image width cannot be greater than ${coreConfig.imageMaxWidth} pixels.`,
    });
  }

  if (image.height > coreConfig.imageMaxHeight) {
    logs.push({
      level: 'error',
      title: 'Large Image Size',
      description: `Image height cannot be greater than ${coreConfig.imageMaxHeight} pixels.`,
    });
  }

  return logs;
}

export function imageCreate(
  image: EntityExtensionCreate<Image, 'title'>,
): Image {
  const imageEntity = entityCreate<Image>(imageKey, {
    ...imageBase,
    ...image,
  });

  return imageEntity;
}
