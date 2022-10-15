import type { Image, ImageBase, ImageBaseCreate } from './image.types.js';
import type { Entity } from '../entity/index.js';
import { fileCreate } from '../file/index.js';

export const imageKey = 'image';

export const imageBase: ImageBase = {
  extension: 'webp',
  mimetype: 'image/webp',
  width: 0,
  height: 0,
  aspect: 0,
  title: '',
  slug: '',
  size: 0,
};

export function imageCreate(
  image: ImageBaseCreate,
  entity: Partial<Entity> = {},
): Image {
  const imageEntity = fileCreate<Image>(imageKey, {
    ...imageBase,
    ...image,
    aspect: image.aspect ?? (image.width / image.height),
  }, entity);

  return imageEntity;
}
