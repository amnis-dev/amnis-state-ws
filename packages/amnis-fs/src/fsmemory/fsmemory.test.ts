import stream from 'node:stream';
import ffmpeg from 'fluent-ffmpeg';
import type { Reference } from '@amnis/core/types';
import type { Image } from '@amnis/core/image/index';
import { reference } from '@amnis/core/core';
import { fsmemory } from './fsmemory';

function imageLoad(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const bufferStream = new stream.PassThrough();

    try {
      ffmpeg(path)
        .addOutputOptions(['-quality 1', '-vf scale=64:-1'])
        .format('webp')
        .writeToStream(bufferStream);
    } catch (e) {
      reject(e);
    }

    const buffers: Uint8Array[] = [];
    bufferStream.on('data', (b) => {
      buffers.push(b);
    });
    bufferStream.on('end', () => {
      const bufferOut = Buffer.concat(buffers);
      resolve(bufferOut);
    });
  });
}

let imageId: Reference<Image> = reference('image');

/**
 * ============================================================
 */
test('file system should save file.', async () => {
  const imageBuffer = await imageLoad('test/iga.png');

  const image = await fsmemory.imageWrite(imageBuffer, { title: 'IGA Logo' });
  if (image) {
    imageId = image?.$id;
  }

  expect(image).toMatchObject({
    title: 'IGA Logo',
    slug: 'iga-logo',
    mimetype: 'image/webp',
    width: 64,
    height: 64,
    size: expect.any(Number),
  });
});

/**
 * ============================================================
 */
test('file system should read saved image file.', async () => {
  const image = await fsmemory.imageRead(imageId);

  if (!image) {
    expect(image).toBeDefined();
    return;
  }

  expect(Buffer.byteLength(image)).toBeGreaterThan(128);
});
