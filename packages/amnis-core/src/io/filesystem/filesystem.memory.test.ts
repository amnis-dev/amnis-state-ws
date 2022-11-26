import stream from 'node:stream';
import ffmpeg from 'fluent-ffmpeg';
import { UID, uid, Image } from '@amnis/core';
import { filesystemMemory } from './filesystem.memory.js';

function imageLoad(path: string): Promise<Uint8Array> {
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
      resolve(new Uint8Array(bufferOut));
    });
  });
}

let imageId: UID<Image> = uid('image');

/**
 * ============================================================
 */
test('file system should save file.', async () => {
  const imageBuffer = await imageLoad('test/iga.png');

  const image = await filesystemMemory.imageWrite(imageBuffer, { title: 'IGA Logo' });
  if (image) {
    imageId = image?.$id;
  }

  expect(image).toMatchObject({
    title: 'IGA Logo',
    slug: 'iga-logo',
    mimetype: 'image/webp',
    width: 0,
    height: 0,
    size: expect.any(Number),
  });
});

/**
 * ============================================================
 */
test('file system should read saved image file.', async () => {
  const image = await filesystemMemory.imageRead(imageId);

  if (!image) {
    expect(image).toBeDefined();
    return;
  }

  expect(Buffer.byteLength(image)).toBeGreaterThan(128);
});