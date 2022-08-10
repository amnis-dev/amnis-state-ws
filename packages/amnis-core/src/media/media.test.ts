import { surl } from '../core.js';
import { mediaKey, mediaCreate } from './media.js';

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
  const media = mediaCreate({
    title: 'Amnis Media',
    source: surl('source'),
  });

  expect(media).toEqual(
    expect.objectContaining({
      title: expect.any(String),
      source: expect.any(String),
    }),
  );
});
