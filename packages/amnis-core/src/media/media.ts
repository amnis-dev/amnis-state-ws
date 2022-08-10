import { surl } from '../core.js';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity/index.js';
import type { LogBaseCreate } from '../log/index.js';
import type { Media } from './media.types.js';

export const mediaKey = 'media';

export const mediaBase: EntityExtension<Media> = {
  title: 'Untitled Media',
  source: surl(''),
  size: 0,
};

/**
 * Media check method.
 */
export function mediaCheck(media: Media): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  return logs;
}

export function mediaCreate(
  media: EntityExtensionCreate<Media, 'title' | 'source'>,
): Media {
  const mediaEntity = entityCreate<Media>(mediaKey, {
    ...mediaBase,
    ...media,
  });

  return mediaEntity;
}
