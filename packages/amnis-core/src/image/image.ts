import type { Image, ImageBase, ImageBaseCreate } from './image.types.js';
import type { EntityCreator } from '../entity/index.js';
import { uid } from '../uid.js';
import { fileCreator } from '../file/file.js';

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

export function imageCreator(
  image: ImageBaseCreate,
): EntityCreator<Image> {
  return {
    ...imageBase,
    ...fileCreator(image),
    aspect: image.aspect ?? (image.width / image.height),
    $id: uid(imageKey),
  };
}
