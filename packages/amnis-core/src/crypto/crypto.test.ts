import { cryptoKey, cryptoCreate } from './crypto.js';

/**
 * ============================================================
 */
test('crypto key should be is properly set', () => {
  expect(cryptoKey).toEqual('crypto');
});

/**
 * ============================================================
 */
test('should create a crypto', () => {
  const crypto = cryptoCreate({
    name: 'Test Crypto Key',
    tag: 'test',
    pair: 'public',
    value: '',
  });

  expect(crypto).toEqual(
    expect.objectContaining({
      name: 'Test Crypto Key',
      type: 'rsa',
      pair: 'public',
      value: '',
    }),
  );
});
