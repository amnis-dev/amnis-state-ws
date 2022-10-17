import { uid } from '../uid.js';
import { userKey } from '../user/index.js';
import { profileKey, profileCreate } from './profile.js';

/**
 * ============================================================
 */
test('profile key should be is properly set', () => {
  expect(profileKey).toEqual('profile');
});

/**
 * ============================================================
 */
test('should create a profile', () => {
  const profile = profileCreate({
    nameDisplay: 'Newbie',
    $user: uid(userKey),
  });

  expect(profile).toEqual(
    expect.objectContaining({
      nameDisplay: expect.any(String),
      $user: expect.any(String),
    }),
  );
});
