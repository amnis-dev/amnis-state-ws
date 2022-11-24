import { keyKey, keyCreate } from './key.js';

/**
 * ============================================================
 */
test('crypto key should be is properly set', () => {
  expect(keyKey).toEqual('key');
});

/**
 * ============================================================
 */
test('should create a crypto', () => {
  const crypto = keyCreate({
    id: 'test',
    name: 'Test Key',
    format: 'raw',
    wrapped: false,
    value: '',
  });

  expect(crypto).toEqual(
    expect.objectContaining({
      id: 'test',
      name: 'Test Key',
      format: 'raw',
      wrapped: false,
      value: '',
    }),
  );
});
