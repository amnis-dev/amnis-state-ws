import { fileCreator } from '../file/file.js';
import { uid } from '../../uid.js';
import type { Video, VideoBase, VideoCreator } from './video.types.js';

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

export function videoCreator(
  video: VideoCreator,
): Video {
  return {
    ...videoBase,
    ...fileCreator(video),
    aspect: video.aspect ?? (video.width / video.height),
    $id: uid(videoKey),
  };
}
