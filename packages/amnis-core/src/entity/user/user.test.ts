import { CryptoPassword } from '../../io/index.js';
import { userKey, userCreator } from './user.js';

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
  const user = userCreator({
    name: 'Newbie',
    password: 'passwd0' as CryptoPassword,
    email: 'newbie@amnis.dev',
  });

  expect(user).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      password: expect.any(String),
      email: expect.any(String),
      $credentials: expect.any(Array),
      $roles: expect.any(Array),
      $permits: expect.any(Array),
    }),
  );
});
