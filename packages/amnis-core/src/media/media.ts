import { surl } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Log } from '../log';
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
export function mediaCheck(media: Media): Log[] {
  const logs: Log[] = [];

  return logs;
}

export function mediaCreate(
  media: EntityExtensionCreate<Media, 'title' | 'source'>,
  checkSkip = false,
): [Media, Log[]] {
  const mediaEntity = entityCreate<Media>(mediaKey, {
    ...mediaBase,
    ...media,
  });

  const logs: Log[] = [];
  if (!checkSkip) {
    logs.push(...mediaCheck(mediaEntity));
  }

  return [mediaEntity, logs];
}
