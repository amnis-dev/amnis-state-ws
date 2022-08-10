import { surl } from '../core.js';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity/index.js';
import type { LogBaseCreate } from '../log/index.js';
import type { Video } from './video.types.js';

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
export function videoCheck(video: Video): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  return logs;
}

export function videoCreate(
  video: EntityExtensionCreate<Video, 'title'>,
): Video {
  const videoEntity = entityCreate<Video>(videoKey, {
    ...videoBase,
    ...video,
  });
  return videoEntity;
}
