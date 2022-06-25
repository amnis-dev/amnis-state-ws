import { surl } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Log } from '../log';
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
export function imageCheck(image: Image): Log[] {
  const logs: Log[] = [];

  return logs;
}

export function imageCreate(
  image: EntityExtensionCreate<Image, 'title'>,
  checkSkip = false,
): [Image, Log[]] {
  const imageEntity = entityCreate<Image>(imageKey, {
    ...imageBase,
    ...image,
  });

  const logs: Log[] = [];
  if (!checkSkip) {
    logs.push(...imageCheck(imageEntity));
  }

  return [imageEntity, logs];
}
