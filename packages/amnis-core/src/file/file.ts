import { Entity, entityCreate } from '../entity/index.js';
import type { File, FileBase, FileBaseCreate } from './file.types.js';

export const fileKey = 'file';

export const fileBase: FileBase = {
  title: 'Untitled File',
  slug: '',
  mimetype: 'text/plain',
  size: 0,
};

export function fileCreate<F extends File>(
  key: string,
  file: FileBaseCreate<F>,
  entity: Partial<Entity> = {},
): F {
  const fileEntity = entityCreate<File>(key, {
    ...fileBase,
    ...file,
    slug: file.slug?.length ? file.slug : file.title.replace(/ /g, '-').replace(/[-]+/g, '-').replace(/[^\w-]+/g, '').toLowerCase(),
  }, entity);

  return fileEntity as F;
}
