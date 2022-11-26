import { imageKey, imageCreator } from './image.js';

/**
 * ============================================================
 */
test('image key should be is properly set', () => {
  expect(imageKey).toEqual('image');
});

/**
 * ============================================================
 */
test('should create a image', () => {
  const image = imageCreator({
    title: 'Amnis Logo',
    extension: 'webp',
    width: 0,
    height: 0,
    mimetype: 'image/webp',
    size: 0,
  });

  expect(image).toEqual(
    expect.objectContaining({
      title: 'Amnis Logo',
      extension: 'webp',
      width: 0,
      height: 0,
      mimetype: 'image/webp',
      size: 0,
    }),
  );
});
