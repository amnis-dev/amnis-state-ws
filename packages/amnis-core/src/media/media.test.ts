import { surl } from '../core';
import { mediaKey, mediaCreate } from './media';

/**
 * ============================================================
 */
test('media key should be is properly set', () => {
  expect(mediaKey).toEqual('media');
});

/**
 * ============================================================
 */
test('should create a media', () => {
  const [media, logs] = mediaCreate({
    title: 'Amnis Media',
    source: surl('source'),
  });

  expect(media).toEqual(
    expect.objectContaining({
      title: expect.any(String),
      source: expect.any(String),
    }),
  );

  expect(logs).toHaveLength(0);
});
