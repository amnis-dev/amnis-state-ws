import { surl } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { LogBaseCreate } from '../log';
import type { Media } from './media.types';

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
  checkSkip = false,
): [Media, LogBaseCreate[]] {
  const mediaEntity = entityCreate<Media>(mediaKey, {
    ...mediaBase,
    ...media,
  });

  const logs: LogBaseCreate[] = [];
  if (!checkSkip) {
    logs.push(...mediaCheck(mediaEntity));
  }

  return [mediaEntity, logs];
}
