import { Entity, entityCreate } from '../entity';
import type { File, FileBase, FileBaseCreate } from './file.types';

export const fileKey = 'file';

export const fileBase: FileBase = {
  title: 'Untitled File',
  slug: 'untitled-file',
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
    slug: file.slug ?? file.title.replace(/ /g, '-').replace(/[-]+/g, '-').replace(/[^\w-]+/g, ''),
  }, entity);

  return fileEntity as F;
}
