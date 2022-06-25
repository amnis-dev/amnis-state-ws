import { surl } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Log } from '../log';
import type { Video } from './video.types';

export const videoKey = 'video';

export const videoBase: EntityExtension<Video> = {
  format: 'webm',
  width: 0,
  height: 0,
  aspect: 0,
  duration: 0,
  title: 'Untitled Video',
  source: surl(''),
  size: 0,
};

/**
 * Video check method.
 */
export function videoCheck(video: Video): Log[] {
  const logs: Log[] = [];

  return logs;
}

export function videoCreate(
  video: EntityExtensionCreate<Video, 'title'>,
  checkSkip = false,
): [Video, Log[]] {
  const videoEntity = entityCreate<Video>(videoKey, {
    ...videoBase,
    ...video,
  });

  const logs: Log[] = [];
  if (!checkSkip) {
    logs.push(...videoCheck(videoEntity));
  }

  return [videoEntity, logs];
}
