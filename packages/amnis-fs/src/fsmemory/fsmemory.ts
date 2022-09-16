import fs from 'node:fs';
import stream from 'node:stream';
import ffmpeg from 'fluent-ffmpeg';
import { imageCreate } from '@amnis/core/image';
import type { FileSystem } from '../types';

const storage: Record<string, Buffer> = {};

export const fsmemory: FileSystem = {
  initialize: () => { /** noop */ },
  saveImage: async (buffer) => new Promise((resolve, reject) => {
    /**
     * Attempt to convert the image buffer data to a webm file.
     */
    const streamRead = fs.createReadStream(buffer);
    const streamWrite = new stream.Writable();
    const command = ffmpeg();
    command
      .input(streamRead)
      .format('webp')
      .addOutputOptions(['-quality 100'])
      .on('error', () => {
        console.error('FS: WRITE FAILED :(');
        reject();
      })
      .on('end', () => {
        console.log('FS: WRITE SUCCESS :)');
        resolve(imageCreate({
          extension: 'webp',
          mimetype: 'image/webp',
          title: 'Unknown Image',
          height: 0,
          width: 0,
          size: 0,
        }));
      })
      .writeToStream(streamWrite);
  }),
};

export default fsmemory;
