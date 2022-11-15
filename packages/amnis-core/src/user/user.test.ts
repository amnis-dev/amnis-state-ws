import { CryptoPassword } from '../crypto.types.js';
import { deviceStringify } from '../device/index.js';
import { userKey, userCreate } from './user.js';

/**
 * ============================================================
 */
test('user key should be is properly set', () => {
  expect(userKey).toEqual('user');
});

/**
 * ============================================================
 */
test('should create a user', async () => {
  const user = userCreate({
    name: 'Newbie',
    password: 'passwd0' as CryptoPassword,
    email: 'newbie@amnis.dev',
    devices: [deviceStringify({
      ip: '176.46.95.196',
      system: 'Windows',
    })],
  });

  expect(user).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      password: expect.any(String),
      email: expect.any(String),
      devices: expect.any(Array),
    }),
  );
});
