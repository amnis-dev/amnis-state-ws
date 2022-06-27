import { surl } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { LogBaseCreate } from '../log';
import type { Image } from './image.types';

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

  return logs;
}

export function imageCreate(
  image: EntityExtensionCreate<Image, 'title'>,
  checkSkip = false,
): [Image, LogBaseCreate[]] {
  const imageEntity = entityCreate<Image>(imageKey, {
    ...imageBase,
    ...image,
  });

  const logs: LogBaseCreate[] = [];
  if (!checkSkip) {
    logs.push(...imageCheck(imageEntity));
  }

  return [imageEntity, logs];
}