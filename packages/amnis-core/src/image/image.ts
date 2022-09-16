import type { Image, ImageBase, ImageBaseCreate } from './image.types';
import type { Entity } from '../entity';
import { fileCreate } from '../file';

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
