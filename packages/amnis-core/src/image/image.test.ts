import { imageKey, imageCreate } from './image';

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
  const [image, logs] = imageCreate({
    title: 'Amnis Logo',
  });

  expect(image).toEqual(
    expect.objectContaining({
      title: expect.any(String),
    }),
  );

  expect(logs).toHaveLength(0);
});
