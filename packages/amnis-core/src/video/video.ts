import { surl } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Video } from './video.types';

export const videoKey = 'video';

export const videoBase: EntityExtension<Video> = {
  extension: 'webm',
  mimetype: 'video/webm',
  width: 0,
  height: 0,
  aspect: 0,
  duration: 0,
  title: 'Untitled Video',
  source: surl(''),
  size: 0,
};

export function videoCreate(
  video: EntityExtensionCreate<Video, 'title'>,
): Video {
  const videoEntity = entityCreate<Video>(videoKey, {
    ...videoBase,
    ...video,
  });
  return videoEntity;
}
