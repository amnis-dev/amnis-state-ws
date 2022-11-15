import { encryptionKey, encryptionCreate } from './encryption.js';

/**
 * ============================================================
 */
test('crypto key should be is properly set', () => {
  expect(encryptionKey).toEqual('encryption');
});

/**
 * ============================================================
 */
test('should create a crypto', () => {
  const crypto = encryptionCreate({
    name: 'Test Encryption',
    tag: 'test',
    value: '',
  });

  expect(crypto).toEqual(
    expect.objectContaining({
      name: 'Test Encryption',
      type: 'rsa',
      value: '',
    }),
  );
});
