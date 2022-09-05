import { surl } from '../core';
import { entityCreate } from '../entity';
import type { Media, MediaBase, MediaBaseCreate } from './media.types';

export const mediaKey = 'media';

export const mediaBase: MediaBase = {
  title: 'Untitled Media',
  source: surl(''),
  size: 0,
};

export function mediaCreate(
  media: MediaBaseCreate,
): Media {
  const mediaEntity = entityCreate<Media>(mediaKey, {
    ...mediaBase,
    ...media,
  });

  return mediaEntity;
}
