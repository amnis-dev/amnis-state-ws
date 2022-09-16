import { fileKey, fileCreate } from './file';

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
  const file = fileCreate(fileKey, {
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
