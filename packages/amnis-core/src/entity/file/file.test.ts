import { fileKey, fileCreator } from './file.js';

/**
 * ============================================================
 */
test('file key should be is properly set', () => {
  expect(fileKey).toEqual('file');
});

/**
 * ============================================================
 */
test('should create a file', () => {
  const file = fileCreator({
    title: 'Amnis File',
    mimetype: 'text/plain',
    size: 0,
  });

  expect(file).toEqual(
    expect.objectContaining({
      title: 'Amnis File',
      mimetype: 'text/plain',
      size: 0,
    }),
  );
});
