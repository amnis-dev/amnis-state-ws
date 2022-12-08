import { dateNumeric } from '../../core.js';
import { sessionCreator, userKey } from '../../entity/index.js';
import { uid } from '../../uid.js';
import { sessionDecrypt, sessionEncrypt } from './session.js';

test('should encrypt a session', async () => {
  const session = sessionCreator({
    $subject: uid(userKey),
    exp: dateNumeric('30m'),
    name: 'Session User',
  });

  const sessionEncrypted = await sessionEncrypt(session);

  expect(sessionEncrypted).toBeDefined();
  expect(sessionEncrypted).toEqual(expect.any(String));
});

test('should encrypt and decrypt a session', async () => {
  const session = sessionCreator({
    $subject: uid(userKey),
    exp: dateNumeric('30m'),
    name: 'Session User',
  });

  const sessionEncrypted = await sessionEncrypt(session);
  const sessionDecrypted = await sessionDecrypt(sessionEncrypted);

  expect(sessionDecrypted).toBeDefined();
  expect(sessionDecrypted).toMatchObject({
    ...session,
    exp: expect.any(Number),
  });
});

test('should encrypt and not decrypt an expired session', async () => {
  const session = sessionCreator({
    $subject: uid(userKey),
    exp: dateNumeric(),
    name: 'Session User',
  });

  const sessionEncrypted = await sessionEncrypt(session);
  expect(sessionEncrypted).toBeDefined();
  expect(sessionEncrypted).toEqual(expect.any(String));

  const sessionDecrypted = await sessionDecrypt(sessionEncrypted);
  expect(sessionDecrypted).toBeUndefined();
});
