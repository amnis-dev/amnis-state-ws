import type { Entity } from '../entity';
import { fileCreate } from '../file';
import type { Video, VideoBase, VideoBaseCreate } from './video.types';

export const videoKey = 'video';

export const videoBase: VideoBase = {
  extension: 'webm',
  mimetype: 'video/webm',
  width: 0,
  height: 0,
  aspect: 0,
  duration: 0,
  title: 'Untitled Video',
  slug: 'untitled-video',
  size: 0,
};

export function videoCreate(
  video: VideoBaseCreate,
  entity: Entity,
): Video {
  const videoEntity = fileCreate<Video>(videoKey, {
    ...videoBase,
    ...video,
    aspect: video.aspect ?? (video.width / video.height),
  }, entity);

  return videoEntity;
}
