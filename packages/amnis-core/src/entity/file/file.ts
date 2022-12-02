import { uid } from '../../uid.js';
import type { File, FileBase, FileCreator } from './file.types.js';

export const fileKey = 'file';

export const fileBase: FileBase = {
  title: 'Untitled File',
  slug: '',
  mimetype: 'text/plain',
  size: 0,
};

export function fileCreator(
  file: FileCreator,
): File {
  return {
    ...fileBase,
    ...file,
    slug: file.slug?.length ? file.slug : file.title.replace(/ /g, '-').replace(/[-]+/g, '-').replace(/[^\w-]+/g, '').toLowerCase(),
    $id: uid(fileKey),
  };
}
