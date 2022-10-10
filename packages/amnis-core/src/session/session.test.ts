import { dateNumeric, uid } from '../core';
import { sessionKey, sessionCreate } from './session';

/**
 * ============================================================
 */
test('session key should be is properly set', () => {
  expect(sessionKey).toEqual('session');
});

/**
 * ============================================================
 */
test('should create a session', () => {
  const session = sessionCreate({
    $subject: uid('user'),
    name: 'Newbie',
    exp: dateNumeric(),
  });

  expect(session).toEqual(
    expect.objectContaining({
      $subject: expect.any(String),
      name: expect.any(String),
      exp: expect.any(Number),
    }),
  );
});
